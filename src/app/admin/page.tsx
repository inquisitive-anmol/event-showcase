import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { getUserById } from '../actions/user-management';
import Link from 'next/link';

const AdminPage = async () => {
    const { userId } = await auth();
    if (!userId) {
        redirect('/sign-in');
    }    
    else {
        const user = await getUserById(userId);
        if (user.publicMetadata.role !== 'admin') {
            redirect('/');
        }
    }
    return (
        <div className='w-full h-screen flex gap-2 flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>Welcome to Admin Page</h1>
            <h3 className='text-lg text-gray-400/90'>Manage your events and users</h3>
                <div className='flex flex-col gap-2'>
                <Link title='Manage your settings' href="/admin/settings" className='text-lg hover:text-sky-500 transition-colors'>Settings</Link>
                <Link title='Manage your users' href="/admin/users" className='text-lg hover:text-sky-500 transition-colors'>Users</Link>
            </div>
        </div>
    )
}

export default AdminPage