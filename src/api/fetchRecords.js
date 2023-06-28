const buildQueryString = (params) => {
    const queryParams = [];
    for (const key in params) {
        const value = params[key];
        if (value !== undefined && value !== null) {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
    }
    return queryParams.join('&');
}

export const fetchRecordsByPage = (token, pagination, filter = {}) => {
    const queryString = buildQueryString({...pagination,...filter});

    const url = `${process.env.REACT_APP_SERVER_HOST}/v1/records?${queryString}`;

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
            .then(data => {
                const records = data.records.map( record => {
                    return {
                        id: record.id,
                        operation: record.operation.type,
                        amount: Number(record.amount),
                        userBalance: Number(record.userBalance),
                        response: record.operationResponse,
                        date: new Date(record.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                    }
                });
                resolve({records: records, total: data.total});       
            })
            .catch(error => {
                reject(error);
            }));
}