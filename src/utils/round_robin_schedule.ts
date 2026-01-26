import { IGroup, IGroupTeam } from "../types/group.types";
import { ITournament } from "../types/tournament.types";
import { addMinutes, formatDuration, parseDuration } from "./dateFormatter";

export interface Group {
    name: string;
    teams: string[];
}

export interface Match {
    no: number;
    time?: string;
    group: string;
    teamA: string;
    teamB: string;
    venue?: string;
    status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
    scoreA?: number;
    scoreB?: number;
}

export interface ScheduleOptions {
    includeVenue?: boolean;
    defaultVenue?: string;
    maxMatchesPerDay?: number;
    startDate?: Date;
}

// Utility function to convert IGroup to Group
function convertToGroup(group: IGroup): Group {
    const teams = group.group_team_records.map((team: IGroupTeam) => team.team_record.name);
    return {
        name: group.name,
        teams: teams,
    };
}

/**
 * Validates tournament configuration for schedule generation
 * @param tournament - Tournament object
 * @returns True if valid, throws error if invalid
 */
function validateTournamentConfig(tournament: ITournament): boolean {
    if (!tournament.start_time) {
        throw new Error('Tournament start_time is required');
    }

    if (!tournament.playing_time || tournament.playing_time <= 0) {
        throw new Error('Tournament playing_time must be greater than 0');
    }

    if (tournament.pause_between_games < 0) {
        throw new Error('Tournament pause_between_games cannot be negative');
    }

    return true;
}

/**
 * Validates group configuration
 * @param groups - Array of groups
 * @returns True if valid, throws error if invalid
 */
function validateGroups(groups: IGroup[]): boolean {
    if (!groups || groups.length === 0) {
        throw new Error('At least one group is required');
    }

    groups.forEach((group, index) => {
        if (!group.name) {
            throw new Error(`Group at index ${index} must have a name`);
        }

        if (!group.group_team_records || group.group_team_records.length < 2) {
            throw new Error(`Group "${group.name}" must have at least 2 teams`);
        }
    });

    return true;
}

export function generateMatchSchedule(
    groups: IGroup[],
    tournament: ITournament,
    options: ScheduleOptions = {}
): Match[] {
    // Validate inputs
    validateTournamentConfig(tournament);
    validateGroups(groups);

    const matchSchedule: Match[] = [];
    const { includeVenue = false, defaultVenue, maxMatchesPerDay } = options;

    // Generate matches for each group
    groups.forEach((group) => {
        const convertedGroup = convertToGroup(group);

        // Generate matches for the group (round-robin: each team plays every other team once)
        for (let i = 0; i < convertedGroup.teams.length - 1; i++) {
            for (let j = i + 1; j < convertedGroup.teams.length; j++) {
                const teamA = convertedGroup.teams[i];
                const teamB = convertedGroup.teams[j];

                if (!teamA || !teamB) {
                    console.warn(`Skipping match with invalid team names in group ${convertedGroup.name}`);
                    continue;
                }

                const match: Match = {
                    no: matchSchedule.length + 1,
                    teamA: teamA,
                    teamB: teamB,
                    group: convertedGroup.name,
                    status: 'scheduled',
                    ...(includeVenue && defaultVenue && { venue: defaultVenue }),
                };
                matchSchedule.push(match);
            }
        }
    });

    if (matchSchedule.length === 0) {
        throw new Error('No matches could be generated from the provided groups');
    }

    // Shuffle the matches to avoid predictable ordering
    const shuffledMatches = shuffleArrayWithoutRandom(matchSchedule);

    // Apply match times in increasing order
    const matchesWithTime = shuffledMatches.map((match, index) => {
        const matchTime = calculateMatchTime(index + 1, tournament);
        return {
            ...match,
            time: matchTime,
        };
    });

    // Apply daily limits if specified
    const finalMatches = applyDailyLimits(matchesWithTime, maxMatchesPerDay, tournament);

    // Output the matches with increasing order of time (only in development)
    if (process.env.NODE_ENV === 'development') {
        finalMatches.forEach((match) => {
            console.log(`${match.no}\t${match.time}\t${match.group}\t${match.teamA}\t${match.teamB}`);
        });
    }

    return finalMatches;
}

/**
 * Applies daily match limits to the schedule
 * @param matches - Array of matches
 * @param maxMatchesPerDay - Maximum matches per day (optional)
 * @param tournament - Tournament configuration
 * @returns Array of matches with adjusted times
 */
function applyDailyLimits(
    matches: Match[],
    maxMatchesPerDay: number | undefined,
    tournament: ITournament
): Match[] {
    if (!maxMatchesPerDay || maxMatchesPerDay <= 0) {
        return matches;
    }

    const dailyMatches: Match[][] = [];
    let currentDay: Match[] = [];
    let currentDayStartTime = tournament.start_time;

    matches.forEach((match, index) => {
        if (currentDay.length >= maxMatchesPerDay) {
            dailyMatches.push(currentDay);
            currentDay = [];
            // Reset to start time for new day
            currentDayStartTime = tournament.start_time;
        }

        // Calculate time within current day
        const matchNumberInDay = currentDay.length + 1;
        const [startHour, startMinute] = currentDayStartTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const matchStartMinutes = startMinutes + matchNumberInDay * (tournament.playing_time + tournament.pause_between_games);
        const matchStartHour = Math.floor(matchStartMinutes / 60) % 24;
        const matchStartMin = matchStartMinutes % 60;

        const matchTime = `${String(matchStartHour).padStart(2, "0")}:${String(matchStartMin).padStart(2, "0")}`;
        currentDay.push({
            ...match,
            time: matchTime,
        });
    });

    if (currentDay.length > 0) {
        dailyMatches.push(currentDay);
    }

    return dailyMatches.flat();
}

const calculateMatchTime = (matchNumber: number, tournament: ITournament): string => {
    if (!tournament.start_time) {
        throw new Error('Tournament start_time is required');
    }

    const startTime = tournament.start_time;
    const playingTime = tournament.playing_time || 90; // Default 90 minutes
    const pauseBetweenGames = tournament.pause_between_games || 15; // Default 15 minutes

    // Convert start_time to minutes for easier calculation
    const timeParts = startTime.split(":");
    if (timeParts.length !== 2) {
        throw new Error(`Invalid start_time format: ${startTime}. Expected HH:mm format.`);
    }

    const [startHour, startMinute] = timeParts.map(Number);

    if (isNaN(startHour) || isNaN(startMinute) || startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59) {
        throw new Error(`Invalid start_time values: ${startTime}`);
    }

    const startMinutes = startHour * 60 + startMinute;

    // Calculate match time based on start time, playing time, and pause between games
    const matchStartMinutes = startMinutes + (matchNumber - 1) * (playingTime + pauseBetweenGames);

    // Handle day overflow (matches can span multiple days)
    const totalMinutesInDay = 24 * 60;
    const matchStartMinutesNormalized = matchStartMinutes % totalMinutesInDay;

    // Convert match start time back to HH:mm format
    const matchStartHour = Math.floor(matchStartMinutesNormalized / 60);
    const matchStartMinute = matchStartMinutesNormalized % 60;

    const formattedMatchTime = `${String(matchStartHour).padStart(2, "0")}:${String(matchStartMinute).padStart(2, "0")}`;
    return formattedMatchTime;
};

const shuffleArrayWithoutRandom = <T>(array: T[]): T[] => {
    if (array.length === 0) {
        return array;
    }

    if (array.length === 1) {
        return [...array];
    }

    // Divide the array into two halves
    const midpoint = Math.floor(array.length / 2);
    const firstHalf = array.slice(0, midpoint);
    const secondHalf = array.slice(midpoint);

    // Interleave the elements of the two halves
    const shuffledArray: T[] = [];
    const maxLength = Math.max(firstHalf.length, secondHalf.length);

    for (let i = 0; i < maxLength; i++) {
        if (i < firstHalf.length) {
            shuffledArray.push(firstHalf[i]);
        }
        if (i < secondHalf.length) {
            shuffledArray.push(secondHalf[i]);
        }
    }

    return shuffledArray;
};

/**
 * Calculates the total number of matches for a round-robin tournament
 * @param numberOfTeams - Number of teams in the group
 * @returns Total number of matches
 */
export function calculateTotalMatches(numberOfTeams: number): number {
    if (numberOfTeams < 2) {
        return 0;
    }
    // Round-robin: n teams = n * (n-1) / 2 matches
    return (numberOfTeams * (numberOfTeams - 1)) / 2;
}

/**
 * Calculates the total duration of all matches
 * @param matches - Array of matches
 * @param playingTime - Playing time per match in minutes
 * @param pauseBetweenGames - Pause between games in minutes
 * @returns Total duration in seconds
 */
export function calculateTotalDuration(
    matches: Match[],
    playingTime: number,
    pauseBetweenGames: number
): number {
    if (matches.length === 0) {
        return 0;
    }

    const totalMinutes = matches.length * (playingTime + pauseBetweenGames) - pauseBetweenGames;
    return totalMinutes * 60;
}

/**
 * Gets matches for a specific group
 * @param matches - Array of all matches
 * @param groupName - Name of the group
 * @returns Array of matches for the group
 */
export function getMatchesForGroup(matches: Match[], groupName: string): Match[] {
    return matches.filter((match) => match.group === groupName);
}

/**
 * Gets matches for a specific team
 * @param matches - Array of all matches
 * @param teamName - Name of the team
 * @returns Array of matches for the team
 */
export function getMatchesForTeam(matches: Match[], teamName: string): Match[] {
    return matches.filter(
        (match) => match.teamA === teamName || match.teamB === teamName
    );
}

/**
 * Updates match score
 * @param matches - Array of matches
 * @param matchNo - Match number
 * @param scoreA - Score for team A
 * @param scoreB - Score for team B
 * @returns Updated array of matches
 */
export function updateMatchScore(
    matches: Match[],
    matchNo: number,
    scoreA: number,
    scoreB: number
): Match[] {
    return matches.map((match) => {
        if (match.no === matchNo) {
            return {
                ...match,
                scoreA,
                scoreB,
                status: 'completed',
            };
        }
        return match;
    });
}

/**
 * Sets match status
 * @param matches - Array of matches
 * @param matchNo - Match number
 * @param status - New status
 * @returns Updated array of matches
 */
export function setMatchStatus(
    matches: Match[],
    matchNo: number,
    status: Match['status']
): Match[] {
    return matches.map((match) => {
        if (match.no === matchNo) {
            return {
                ...match,
                status,
            };
        }
        return match;
    });
}