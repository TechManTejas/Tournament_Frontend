import { IGroup, IGroupTeam } from "../types/group.types"; // Import your types here
import { ITournament } from "../types/tournament.types";

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
}

// Utility function to convert IGroup to Group
function convertToGroup(group: IGroup): Group {
    const teams = group.group_team_records.map((team: IGroupTeam) => team.team_record.name);
    return {
        name: group.name,
        teams: teams,
    };
}

export function generateMatchSchedule(groups: IGroup[], tournament: ITournament): Match[] {
    const matchSchedule: Match[] = [];

    // Generate matches for each group
    groups.forEach((group) => {
        const convertedGroup = convertToGroup(group);

        // Generate matches for the group
        for (let i = 0; i < convertedGroup.teams.length - 1; i++) {
            for (let j = i + 1; j < convertedGroup.teams.length; j++) {
                const teamA = convertedGroup.teams[i];
                const teamB = convertedGroup.teams[j];

                const match: Match = {
                    no: matchSchedule.length + 1, // Increment match number
                    teamA: teamA,
                    teamB: teamB,
                    group: convertedGroup.name,
                };
                matchSchedule.push(match);
            }
        }
    });

    // Shuffle the matches
    const shuffledMatches = shuffleArrayWithoutRandom(matchSchedule);

    // Apply match times in increasing order
    const matchesWithTime = shuffledMatches.map((match, index) => ({
        ...match,
        time: calculateMatchTime(index + 1, tournament),
    }));

    // Output the matches with increasing order of time
    matchesWithTime.forEach((match) => {
        console.log(`${match.no}\t${match.time}\t${match.group}\t${match.teamA}\t${match.teamB}`);
    });

    return matchesWithTime;
}


const calculateMatchTime = (matchNumber: number, tournament: ITournament): string => {
    // Assuming start_time is in HH:mm format
    const startTime = tournament.start_time;
    const playingTime = tournament.playing_time;
    const pauseBetweenGames = tournament.pause_between_games;

    // Convert start_time to minutes for easier calculation
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;

    // Calculate match time based on start time, playing time, and pause between games
    const matchStartMinutes = startMinutes + matchNumber * (playingTime + pauseBetweenGames);

    // Convert match start time back to HH:mm format
    const matchStartHour = Math.floor(matchStartMinutes / 60);
    const matchStartMinute = matchStartMinutes % 60;

    const formattedMatchTime = `${String(matchStartHour).padStart(2, "0")}:${String(matchStartMinute).padStart(2, "0")}`;
    return formattedMatchTime;
};

const shuffleArrayWithoutRandom = <T>(array: T[]): T[] => {
    // Divide the array into two halves
    const firstHalf = array.slice(0, Math.floor(array.length / 2));
    const secondHalf = array.slice(Math.floor(array.length / 2));

    // Interleave the elements of the two halves
    const shuffledArray = [];
    for (let i = 0; i < Math.max(firstHalf.length, secondHalf.length); i++) {
        if (i < firstHalf.length) {
            shuffledArray.push(firstHalf[i]);
        }
        if (i < secondHalf.length) {
            shuffledArray.push(secondHalf[i]);
        }
    }

    return shuffledArray;
};