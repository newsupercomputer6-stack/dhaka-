/**
 * Compresses an image file to a lightweight data URL thumbnail (max 250x250, JPEG ~15KB)
 * to ensure fast rendering and prevent localStorage quota issues.
 */
export function compressImageFile(file: File, maxDim = 260, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('দয়া করে একটি সঠিক ছবি (JPG, PNG) নির্বাচন করুন'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Fill white background for photos converted to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('ছবি লোড করা সম্ভব হয়নি'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('ফাইল পড়তে ব্যর্থ হয়েছে'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an organization logo file while keeping transparency if PNG/WebP.
 */
export function compressLogoFile(file: File, maxDim = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Do not fill background to preserve transparency
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG for transparency support
        const isPng = file.type.includes('png') || file.type.includes('webp') || file.type.includes('svg');
        const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.88);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('লোগো লোড করা সম্ভব হয়নি'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('ফাইল পড়তে ব্যর্থ হয়েছে'));
    reader.readAsDataURL(file);
  });
}
