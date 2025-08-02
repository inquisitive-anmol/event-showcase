'use client';

import { useTransition, useState, useEffect } from 'react';
import { getUserById, updateUserMetadata } from '@/app/actions/user-management';
import { toast } from 'react-fox-toast';
import { useAuth } from '@clerk/nextjs';

interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
  publicMetadata: {
    tier?: string;
    role?: string;
  };
}

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      console.log(isLoaded, isSignedIn, userId);
      if (isLoaded && isSignedIn &&  userId) {
        try {
          const userData = await getUserById(userId);
          console.log(userData);
          setData(userData);
        } catch (error) {
          console.log("error: ", error);
        }
      }
    };
    fetchData();
  }, [userId, isLoaded, isSignedIn]);
  
  const handleSetTier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tier = formData.get('tier') as string;
    const role = formData.get('role') as string;
    startTransition(() => {
      updateUserMetadata(userId as string, {
        tier: tier as 'free' | 'silver' | 'gold' | 'platinum',
        role: role as 'admin' | 'user',
      })
        .then(() => toast.success('Tier updated'))
        .catch((error) => toast.error('Failed to update tier', error.message));
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl text-sky-500 font-bold">Set User Tier & Role</h1>
   
     {
      data && (
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-lg font-bold'><span className='font-bold text-sky-500'>Name: </span> {data.firstName} {data.lastName}</p>
        <p className='text-lg font-bold'><span className='font-bold text-sky-500'>Email: </span> {data.emailAddresses[0].emailAddress}</p>
        <p className='text-lg font-bold'><span className='font-bold text-sky-500'>User Tier: </span> {data.publicMetadata.tier}</p>
        <p className='text-lg font-bold'><span className='font-bold text-sky-500'>User Role: </span> {data.publicMetadata.role}</p>
          <h3 className='text-lg font-bold text-sky-500'>Update Tier and Role: </h3>
        <form className='flex gap-2 w-full' onSubmit={handleSetTier}>
          <label htmlFor="tier" className='text-sky-500'>Tier: </label>
          <select className='border-2 border-gray-300 rounded-md p-2 text-black bg-sky-100' name="tier" >
            <option value="free">Free</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
          <label htmlFor="role" className='text-sky-500'>Role: </label>
          <select className='border-2 border-gray-300 rounded-md p-2 text-black bg-sky-100' name="role" >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button disabled={isPending} className='bg-blue-500 text-white rounded-md p-2 cursor-pointer' type="submit">Update</button>
        </form>
        </div>
      )
     }
    </div>
  );
}
