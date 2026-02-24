// Actualizamos la base a la carpeta correcta que encontramos
const BASE_RAW_URL = 'https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/images/items';

export const getItems = async () => {
    try {
        const response = await fetch('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items');
        if (!response.ok) throw new Error("Error al acceder a la carpeta");

        const files = await response.json();

        return files.map(file => {
            const id = file.name.replace('.json', '');

            return {
                id: id,
                name: id.replace(/_/g, ' '),

            };
        });
    } catch (error) {
        console.error("Error en Api.js:", error);
        return [];
    }
};

export const getAllItemsData = async (files) => {
    return Promise.all(
        files.map(async (file) => {
            const id = file.name.replace('.json', '');
            const res = await fetch(`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/${id}.json`);
            return res.json();
        })
    )
}

