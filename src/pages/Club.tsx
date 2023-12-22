import { getUserDataFromStorage } from '../utils/storage'

export const Club = () => {

  const user = getUserDataFromStorage()?.user
  const club = user?.club
  console.log(club)

  return (
    <div className='p-6 flex flex-col gap-12 h-screen overflow-auto'>
      <div className='flex gap-4'>
        <div>
          <img src={club?.logo} alt="Club Logo" className='bg-white rounded w-44 h-44 shadow p-4 object-cover' />
        </div>
        <div className='text-2xl p-2'>{club?.name}</div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='text-2xl font-medium'>
          News Feed
        </div>
        <div className='flex gap-12'>
          <div className='bg-white w-96 h-40 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-96 h-40 rounded shadow p-4 object-cover'>

          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='text-2xl font-medium'>
          Upcoming Matches
        </div>
        <div className='flex gap-12'>
          <div className='bg-white w-96 h-32 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-96 h-32 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-96 h-32 rounded shadow p-4 object-cover'>

          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='text-2xl font-medium'>
          Stats
        </div>
        <div className='flex gap-12'>
          <div className='bg-white w-60 h-24 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-60 h-24 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-60 h-24 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-60 h-24 rounded shadow p-4 object-cover'>

          </div>
          <div className='bg-white w-60 h-24 rounded shadow p-4 object-cover'>

          </div>
        </div>
      </div>
    </div>
  )
}
