export const deleteRecord = (token, id) => {

    const url = `${process.env.REACT_APP_SERVER_HOST}/v1/records/${id}`;
    return new Promise((resolve, reject) => 
        fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
            }})
            .then(resp => {
                if (!resp.ok)
                    reject(resp.status);
                return resp.json()
            })
            .then(() => {
               resolve();       
            })
            .catch(error => {
                reject(error);
            }));
}