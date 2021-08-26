export const readFile = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                content: reader.result,
            });
        };

        reader.onerror = error => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
