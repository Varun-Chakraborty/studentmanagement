'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageDropzoneProps {
	onDrop: (acceptedFiles: File[]) => void;
	accept?: string[];
	maxSize?: number;
}

export default function ImageDropzone({
	onDrop,
	accept,
	maxSize
}: ImageDropzoneProps) {
	const onDropCallback = useCallback(
		(acceptedFiles: File[]) => {
			onDrop(acceptedFiles);
		},
		[onDrop]
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			onDrop: onDropCallback,
			accept: accept
				? accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {})
				: undefined,
			maxSize,
			multiple: false
		});

	return (
		<div
			{...getRootProps()}
			className={`border-2 border-dashed rounded-full aspect-square flex flex-col items-center justify-center p-6 transition-colors cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
        ${isDragReject ? 'border-destructive bg-destructive/10' : ''}
        hover:border-primary hover:bg-primary/5`}
		>
			<input {...getInputProps()} />
			<Upload
				className={`h-10 w-10 mb-2 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
			/>
			<p className="text-sm text-center text-muted-foreground">
				{isDragActive
					? 'Drop the image here'
					: 'Drag & drop an image or click to select'}
			</p>
		</div>
	);
}
