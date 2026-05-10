import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '$env/static/private';
import { v2 as cloudinary } from 'cloudinary';

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
	throw new Error('Missing Cloudinary environment variables.');
}

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

export async function uploadImageBuffer(buffer, { folder, publicId }) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				public_id: publicId,
				resource_type: 'image',
				overwrite: false
			},
			(error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			}
		);

		stream.end(buffer);
	});
}

export async function deleteImage(publicId) {
	return cloudinary.uploader.destroy(publicId, {
		resource_type: 'image'
	});
}
