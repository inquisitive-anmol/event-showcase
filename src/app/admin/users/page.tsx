import { getAllUsers } from '@/app/actions/user-management';
import React from 'react'

const UsersPage = async () => {
    const users = await getAllUsers();
    return (
        <div className='w-full h-screen flex gap-2 flex-col items-center p-6'>
            <h1 className='text-xl text-sky-500 font-bold'>Users</h1>
          
            <div className='flex gap-2 w-full flex-col items-start flex-wrap p-10'>
                {users.map((user: any) => (
                    <div key={user.id} className='flex gap-2 flex-col border-2 bg-sky-100/10 border-sky-200 rounded-md p-3 w-fit'>
                        <p className='text-lg text-left'><span className='font-bold text-sky-500'>Email:</span> {user.emailAddresses[0].emailAddress}</p>
                        <p className='text-lg text-left'><span className='font-bold text-sky-500'>Name:</span> {user.firstName} {user.lastName}</p>
                        <p className='text-lg text-left'><span className='font-bold text-sky-500'>Tier:</span> {user.publicMetadata.tier} </p>
                        <p className='text-lg text-left'><span className='font-bold text-sky-500'>Role:</span> {user.publicMetadata.role}</p>
                    </div>
                ))} 
                    </div>
          
        </div>
    )
}

export default UsersPage