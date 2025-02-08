import { cn } from '@/lib/utils'
import { Download } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadImagesContainer {
    value: File[]
    onChange: (value: File[]) => void
}

const UploadImagesContainer: React.FC<UploadImagesContainer> = ({
    value,
    onChange
}) => {

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles)=>{
          onChange([...value,...acceptedFiles])
        },
        accept: { 'image/**': [] }
    })
    return (
        <div className='space-y-2'>
            <div {...getRootProps()}
                className={cn('border-2 border-dashed p-6 rounded-md cursor-pointer h-[150px] w-full flex flex-col justify-center items-center',
                    {
                        'border-primaryColor-500': isDragActive,
                        'border-gray-300': !isDragActive,
                    })}>
                <input {...getInputProps()} />
                {
                    isDragActive ? (
                        <p className='text-[12px] text-[#484848]'>Drop the files here...</p>
                    ) : (
                        <div className='w-full flex flex-col gap-y-2 text-center justify-center items-center'>
                           <Download className='w-4 h-4  [text-[#484848]' />
                           <p className='text-[12px] [text-[#484848]'>Drag & drop here</p>
                           <p className='text-[12px] [text-[#484848]'>or</p>
                           <p className='text-[12px] text-primaryColor-900 font-semibold'>
                            Browse file
                           </p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UploadImagesContainer