import IGeneric from "../../models/GenericModel"
import { firestore } from "firebase"
import { useCollection as useCollectionHook, useDocument as useDocumentHook } from 'react-firebase-hooks/firestore';

export function useCollection<T>(query?: firestore.Query | null | undefined, options?: {
    snapshotListenOptions?: firestore.SnapshotListenOptions | undefined;
} | undefined): [IGeneric<T>[] | undefined, firestore.QuerySnapshot | undefined, boolean] {
    const [value, loading, error] = useCollectionHook(query, options)
    const model = value && value.docs.map(val => {
        const data = val.data() as T
        const model: IGeneric<T> = {
            uid: val.id,
            data
        }
        return model
    })
    if (error) console.error(error)
    return [model, value, loading];
}

export function useDocument<T>(docRef?: firestore.DocumentReference | null | undefined, options?: {
    snapshotListenOptions?: firestore.SnapshotListenOptions | undefined;
} | undefined): [IGeneric<T> | undefined, firestore.DocumentSnapshot | undefined, boolean] {
    const [value, loading, error] = useDocumentHook(docRef, options)
    const getModel = () => {
        if (value) {
            const data = value.data() as T
            const model: IGeneric<T> = {
                uid: value.id,
                data
            }
            return model
        }
    }
    if (error) console.error(error)
    return [getModel(), value, loading]
}