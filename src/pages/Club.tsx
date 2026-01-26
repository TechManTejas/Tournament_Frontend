import { useState, useEffect } from 'react'
import { getUserDataFromStorage } from '../utils/storage'
import { formatDate, isToday, formatRelativeDate } from '../utils/dateFormatter'

interface ClubInfo {
  id: number
  name: string
  logo?: string
  address?: string
  city?: string
  country?: string
  founded?: number
  description?: string
  website?: string
  email?: string
  phone?: string
}

export const Club = () => {
  const user = getUserDataFromStorage()?.user
  const club: ClubInfo | undefined = user?.club
  const [isLoading, setIsLoading] = useState(false)
  const [clubStats, setClubStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  })

  useEffect(() => {
    if (club) {
      console.log('Club data loaded:', club)
      // Simulate loading club statistics
      setIsLoading(true)
      setTimeout(() => {
        setClubStats({
          totalMatches: 45,
          wins: 28,
          losses: 12,
          draws: 5,
        })
        setIsLoading(false)
      }, 500)
    }
  }, [club])

  const winPercentage = clubStats.totalMatches > 0
    ? Math.round((clubStats.wins / clubStats.totalMatches) * 100)
    : 0

  const getClubDisplayName = (): string => {
    if (!club) return 'No Club Information'
    return club.name || 'Unnamed Club'
  }

  const getClubLogoUrl = (): string => {
    if (club?.logo) return club.logo
    return '/src/assets/images/team_1.png'
  }

  const getClubLocation = (): string => {
    const parts: string[] = []
    if (club?.city) parts.push(club.city)
    if (club?.country) parts.push(club.country)
    return parts.length > 0 ? parts.join(', ') : 'Location not specified'
  }

  const getClubAge = (): number | null => {
    if (!club?.founded) return null
    const currentYear = new Date().getFullYear()
    return currentYear - club.founded
  }

  if (!club) {
    return (
      <div className='p-6 flex flex-col gap-12 h-screen overflow-auto'>
        <div className='text-center text-gray-500 mt-20'>
          <h2 className='text-2xl font-semibold mb-4'>No Club Information Available</h2>
          <p>Please contact your administrator to set up club information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 flex flex-col gap-12 h-screen overflow-auto'>
      <div className='flex gap-4 items-start'>
        <div className='flex-shrink-0'>
          <img
            src={getClubLogoUrl()}
            alt="Club Logo"
            className='bg-white rounded w-44 h-44 shadow p-4 object-cover'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/src/assets/images/team_1.png'
            }}
          />
        </div>
        <div className='flex-grow'>
          <h1 className='text-3xl font-bold mb-2'>{getClubDisplayName()}</h1>
          {club.description && (
            <p className='text-gray-600 mb-4'>{club.description}</p>
          )}
          <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
            {getClubLocation() !== 'Location not specified' && (
              <span className='flex items-center gap-1'>
                <span>📍</span>
                {getClubLocation()}
              </span>
            )}
            {club.founded && (
              <span className='flex items-center gap-1'>
                <span>📅</span>
                Founded {club.founded}
                {getClubAge() && ` (${getClubAge()} years old)`}
              </span>
            )}
            {club.email && (
              <span className='flex items-center gap-1'>
                <span>✉️</span>
                {club.email}
              </span>
            )}
            {club.phone && (
              <span className='flex items-center gap-1'>
                <span>📞</span>
                {club.phone}
              </span>
            )}
            {club.website && (
              <a
                href={club.website}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-blue-600 hover:underline'
              >
                <span>🌐</span>
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className='text-center py-8'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
          <p className='mt-2 text-gray-500'>Loading club statistics...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-sm font-medium text-gray-500 mb-2'>Total Matches</h3>
            <p className='text-3xl font-bold'>{clubStats.totalMatches}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-sm font-medium text-gray-500 mb-2'>Wins</h3>
            <p className='text-3xl font-bold text-green-600'>{clubStats.wins}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-sm font-medium text-gray-500 mb-2'>Losses</h3>
            <p className='text-3xl font-bold text-red-600'>{clubStats.losses}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-sm font-medium text-gray-500 mb-2'>Win Rate</h3>
            <p className='text-3xl font-bold text-blue-600'>{winPercentage}%</p>
          </div>
        </div>
      )}

      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Club Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {club.address && (
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-1'>Address</h3>
              <p className='text-gray-900'>{club.address}</p>
            </div>
          )}
          {club.founded && (
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-1'>Founded</h3>
              <p className='text-gray-900'>
                {formatDate(new Date(club.founded, 0, 1), { format: 'long' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
