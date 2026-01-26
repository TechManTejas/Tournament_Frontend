import { describe, it, expect } from 'vitest'
import { generateMatchSchedule } from './round_robin_schedule'
import { IGroup, IGroupTeam } from '../types/group.types'
import { ITournament } from '../types/tournament.types'
import { IClub } from '../types/club.types'
import { ITeamRecord } from '../types/team.types'
import { IRound } from '../types/round.types'

describe('round_robin_schedule', () => {
  const createMockTournament = (): ITournament => ({
    id: 1,
    game_mode: {
      id: 1,
      name: 'Round Robin',
      description: 'Round Robin tournament',
      data: {} as JSON,
    },
    club: {
      id: 1,
      name: 'Test Club',
    } as IClub,
    name: 'Test Tournament',
    alias: 'test-tournament',
    logo: '',
    points_draw: 1,
    start_time: '10:00',
    start_date: '2024-01-01',
    no_of_teams: 4,
    no_of_groups: 1,
    playing_time: 90,
    pause_between_games: 15,
    points_winner: 3,
    points_defeat: 0,
    timer: '90:00',
    status: 'active',
  })

  const createMockGroup = (teamNames: string[]): IGroup => {
    const groupTeams: IGroupTeam[] = teamNames.map((name, index) => ({
      id: index + 1,
      team_record: {
        id: index + 1,
        name: name,
      } as ITeamRecord,
      points: 0,
      goals_pos: 0,
      goals_neg: 0,
      order: index + 1,
    }))

    return {
      id: 1,
      club: { id: 1, name: 'Test Club' } as IClub,
      tournament: createMockTournament(),
      round: { id: 1, name: 'Round 1' } as IRound,
      group_team_records: groupTeams,
      name: 'Group A',
    }
  }

  describe('generateMatchSchedule', () => {
    it('should generate matches for a group with 2 teams', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament)

      expect(matches).toHaveLength(1)
      expect(matches[0].teamA).toBe('Team A')
      expect(matches[0].teamB).toBe('Team B')
      expect(matches[0].group).toBe('Group A')
      expect(matches[0].time).toBeTruthy()
    })

    it('should generate matches for a group with 4 teams', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C', 'Team D'])]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament)

      // 4 teams = 6 matches (n*(n-1)/2)
      expect(matches).toHaveLength(6)
      
      // Check that all teams are included
      const allTeams = matches.flatMap(m => [m.teamA, m.teamB])
      expect(allTeams).toContain('Team A')
      expect(allTeams).toContain('Team B')
      expect(allTeams).toContain('Team C')
      expect(allTeams).toContain('Team D')
    })

    it('should generate matches for multiple groups', () => {
      const groups = [
        createMockGroup(['Team A', 'Team B']),
        createMockGroup(['Team C', 'Team D']),
      ]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament)

      // 2 groups with 2 teams each = 2 matches total
      expect(matches).toHaveLength(2)
    })

    it('should assign match times based on tournament settings', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C'])]
      const tournament = createMockTournament()
      tournament.start_time = '09:00'
      tournament.playing_time = 60
      tournament.pause_between_games = 10

      const matches = generateMatchSchedule(groups, tournament)

      expect(matches.length).toBeGreaterThan(0)
      matches.forEach((match, index) => {
        expect(match.time).toBeTruthy()
        expect(match.time).toMatch(/^\d{2}:\d{2}$/)
      })
    })

    it('should assign unique match numbers', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C', 'Team D'])]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament)

      const matchNumbers = matches.map(m => m.no)
      const uniqueNumbers = new Set(matchNumbers)
      expect(uniqueNumbers.size).toBe(matchNumbers.length)
    })

    it('should include group name in each match', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament)

      matches.forEach(match => {
        expect(match.group).toBe('Group A')
      })
    })
  })
})

