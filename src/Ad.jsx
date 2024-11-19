import React, { useEffect  } from 'react';

const Ad = (props) => {
    const { dataAdSlot } = props;  



    useEffect(() => {

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }

        catch (e) {

        }

    },[]);



    return (
        <div className=" ">
            <ins className="adsbygoogle"
    style={{ display: 'inline-block', width: '100%', height:'100%'}}
                data-ad-client="ca-pub-1340051728330748"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto"
  
                >
            </ins>
        </div>
    );
};

export default Ad;