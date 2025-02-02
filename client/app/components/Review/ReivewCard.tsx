import Ratings from '@/app/utils/Ratings';
import Image from 'next/image';
import React from 'react'

type Props = {
    item: any;
}

const ReivewCard = (props: Props) => {
  return (
    <div className="w-full  dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur dark:border-[#ffffff45] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner hover:scale-105 transition: all 0.2s ease-in-out bg-[#fff]">
        <div className='flex w-full'>
            <Image
            src={props.item.avatar}
            alt=''
            width={50}
            height={50}
            className='w-[50px] h-[50px] rounded-full object-cover'
            />
            <div className='800px:flex justify-between w-full hidden'>
                <div className='pl-4'>
                    <h5 className='text-[20px] text-black dark:text-white'>
                        {props.item.name}
                    </h5>
                    <h6 className='text-[16px] text-[#000] dark:text-white'>
                        {props.item.course}
                    </h6>
                    <br />
                    <p>
                        {props.item.comment}
                    </p>
                </div>
                <Ratings rating={4}/>
            </div>
            {/* for mobile */}
            <div className='800px:hidden justify-between w-full flex-col'>
                <div className='pl-4'>
                    <h5 className='text-[20px] text-black dark:text-white'>
                        {props.item.name}
                    </h5>
                    <h6 className='text-[16px] text-[#000] dark:text-white'>
                        {props.item.course}
                    </h6>
                    <br />
                    <p>
                        {props.item.comment}
                    </p>
                </div>
                <Ratings rating={props.item.ratings}/>
            </div>
        </div>
    </div>
  )
}

export default ReivewCard