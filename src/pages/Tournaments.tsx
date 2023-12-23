import React, { useEffect } from 'react';

export const Tournaments = () => {
  useEffect(() => {
    // Algorithm for scheduling football tournament
    class FootballTournamentScheduler {
      teams: string[];
      groups: string[][];

      constructor(teams: string[][]) {
        this.teams = teams.flat();
        this.groups = teams;
      }

      generateSchedule(): string[][] {
        const schedule: string[][] = [];

        // Round-robin within each group
        for (const group of this.groups) {
          const groupSchedule = this.generateRoundRobin(group);
          schedule.push(...groupSchedule);
        }

        // Organize the schedule to alternate between groups
        const organizedSchedule = this.organizeSchedule(schedule);

        return organizedSchedule;
      }

      generateRoundRobin(group: string[]): string[][] {
        const roundRobinSchedule: string[][] = [];
        const groupSize = group.length;

        // Ensure each team plays against every other team exactly once
        for (let i = 0; i < groupSize - 1; i++) {
          for (let j = i + 1; j < groupSize; j++) {
            const match = [group[i], group[j]];
            roundRobinSchedule.push(match);
          }
        }

        // Shuffle the matches to avoid consecutive matches for the same team
        this.shuffle(roundRobinSchedule);

        return roundRobinSchedule;
      }

      shuffle(array: any[]): void {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      }

      organizeSchedule(schedule: string[][]): string[][] {
        const organizedSchedule: string[][] = [];
        const groupsCount = this.groups.length;

        for (let i = 0; i < groupsCount; i++) {
          for (let j = i; j < schedule.length; j += groupsCount) {
            organizedSchedule.push(schedule[j]);
          }
        }

        return organizedSchedule;
      }
    }

    // Example usage
    const teamsInGroups = [
      ['TeamA', 'TeamB', 'TeamC', 'TeamD', 'TeamE'],
      ['TeamF', 'TeamG', 'TeamH', 'TeamI', 'TeamJ'],
      ['TeamK', 'TeamL', 'TeamM', 'TeamN', 'TeamO'],
      ['TeamP', 'TeamQ', 'TeamR', 'TeamS', 'TeamT'],
    ];

    const scheduler = new FootballTournamentScheduler(teamsInGroups);
    const tournamentSchedule = scheduler.generateSchedule();

    // Display the schedule in the console
    console.log('Tournament Schedule:');
    console.log(tournamentSchedule);
    console.log('Total Matches:', tournamentSchedule.length);
  }, []); // Empty dependency array ensures that the effect runs only once when the component mounts

  return <div>Tournaments</div>;
};
