export const performCalculation = (token, params) => {
        
    let url = `${process.env.REACT_APP_SERVER_HOST}/v1/calculator/${params.method}/${params.operator}`;
    let body = {operands: params.operands.map( n => Number(n))};

    console.log(body)
    return new Promise((resolve, reject) => 
        fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)})
            .then(resp => {
                if (!resp.ok) 
                    return resp.json().then((data) => {
                        throw new Error(data.message);
                    });                
                return resp.json()
            })
            .then((data) => {
               resolve(data.result);       
            })
            .catch(error => {
                reject(error.message);
            }));
}