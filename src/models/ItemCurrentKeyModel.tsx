
import {useState} from 'react';

export default function CurrentKey(){
    const [key,setKey] = useState<string>('');
    return {
        key,setKey
    };

}
