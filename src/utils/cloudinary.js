// Simple Cloudinary upload implementation
export const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      try {
        // Use fetch to upload to Cloudinary directly
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'customer');
        formData.append('folder', 'customer');
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dzbfpxsob/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );
        
        const result = await response.json();
        
        resolve({
          url: result.secure_url,
          public_id: result.public_id
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

// Upload multiple images
export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};
