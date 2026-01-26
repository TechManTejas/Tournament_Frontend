import { describe, it, expect } from 'vitest'
import {
  generateMatchSchedule,
  calculateTotalMatches,
  calculateTotalDuration,
  getMatchesForGroup,
  getMatchesForTeam,
  updateMatchScore,
  setMatchStatus,
} from './round_robin_schedule'
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

    it('should handle options with venue', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament, {
        includeVenue: true,
        defaultVenue: 'Stadium 1',
      })

      expect(matches[0].venue).toBe('Stadium 1')
    })

    it('should apply daily match limits', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C', 'Team D'])]
      const tournament = createMockTournament()

      const matches = generateMatchSchedule(groups, tournament, {
        maxMatchesPerDay: 2,
      })

      expect(matches.length).toBe(6) // Still 6 matches total
      expect(matches[0].time).toBeTruthy()
    })

    it('should throw error for invalid tournament config', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      delete (tournament as any).start_time

      expect(() => generateMatchSchedule(groups, tournament)).toThrow('start_time is required')
    })

    it('should throw error for empty groups', () => {
      const tournament = createMockTournament()
      expect(() => generateMatchSchedule([], tournament)).toThrow('At least one group is required')
    })

    it('should throw error for group with less than 2 teams', () => {
      const groups = [createMockGroup(['Team A'])]
      const tournament = createMockTournament()

      expect(() => generateMatchSchedule(groups, tournament)).toThrow('at least 2 teams')
    })
  })

  describe('calculateTotalMatches', () => {
    it('should calculate total matches correctly', () => {
      expect(calculateTotalMatches(2)).toBe(1)
      expect(calculateTotalMatches(4)).toBe(6)
      expect(calculateTotalMatches(8)).toBe(28)
      expect(calculateTotalMatches(1)).toBe(0)
    })

    it('should return 0 for invalid team counts', () => {
      expect(calculateTotalMatches(0)).toBe(0)
      expect(calculateTotalMatches(-1)).toBe(0)
    })
  })

  describe('calculateTotalDuration', () => {
    it('should calculate total duration correctly', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const duration = calculateTotalDuration(matches, 90, 15)
      expect(duration).toBeGreaterThan(0)
    })

    it('should return 0 for empty matches', () => {
      const duration = calculateTotalDuration([], 90, 15)
      expect(duration).toBe(0)
    })
  })

  describe('getMatchesForGroup', () => {
    it('should filter matches by group', () => {
      const groups = [
        createMockGroup(['Team A', 'Team B']),
        { ...createMockGroup(['Team C', 'Team D']), name: 'Group B' },
      ]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const groupAMatches = getMatchesForGroup(matches, 'Group A')
      expect(groupAMatches.length).toBe(1)
      expect(groupAMatches[0].group).toBe('Group A')
    })

    it('should return empty array for non-existent group', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const result = getMatchesForGroup(matches, 'Non-existent Group')
      expect(result).toEqual([])
    })
  })

  describe('getMatchesForTeam', () => {
    it('should filter matches by team', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const teamAMatches = getMatchesForTeam(matches, 'Team A')
      expect(teamAMatches.length).toBe(2) // Team A plays Team B and Team C
      expect(teamAMatches.every(m => m.teamA === 'Team A' || m.teamB === 'Team A')).toBe(true)
    })

    it('should return empty array for non-existent team', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const result = getMatchesForTeam(matches, 'Non-existent Team')
      expect(result).toEqual([])
    })
  })

  describe('updateMatchScore', () => {
    it('should update match score', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const updated = updateMatchScore(matches, 1, 2, 1)
      expect(updated[0].scoreA).toBe(2)
      expect(updated[0].scoreB).toBe(1)
      expect(updated[0].status).toBe('completed')
    })

    it('should not modify other matches', () => {
      const groups = [createMockGroup(['Team A', 'Team B', 'Team C'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const updated = updateMatchScore(matches, 1, 2, 1)
      expect(updated.length).toBe(matches.length)
      expect(updated[1].scoreA).toBeUndefined()
    })

    it('should handle non-existent match number', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const updated = updateMatchScore(matches, 999, 2, 1)
      expect(updated).toEqual(matches)
    })
  })

  describe('setMatchStatus', () => {
    it('should update match status', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const updated = setMatchStatus(matches, 1, 'live')
      expect(updated[0].status).toBe('live')
    })

    it('should handle all status types', () => {
      const groups = [createMockGroup(['Team A', 'Team B'])]
      const tournament = createMockTournament()
      const matches = generateMatchSchedule(groups, tournament)

      const statuses: Array<'scheduled' | 'live' | 'completed' | 'cancelled'> = [
        'scheduled',
        'live',
        'completed',
        'cancelled',
      ]

      statuses.forEach((status) => {
        const updated = setMatchStatus(matches, 1, status)
        expect(updated[0].status).toBe(status)
      })
    })
  })
})

