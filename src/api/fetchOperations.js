export const fetchOperations = (token) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/v1/calculator/operations`;
    return new Promise((resolve, reject) => 
        fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
            }})
            .then(resp => {
                if (!resp.ok)
                    reject(resp.status);
                return resp.json()
            })
            .then((data) => {
               resolve(data.operations);       
            })
            .catch(error => {
                reject(error);
            }));
}