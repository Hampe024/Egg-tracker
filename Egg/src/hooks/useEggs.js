import { useEffect, useState } from 'react'
import { onValue, push, ref, remove } from 'firebase/database'
import { db } from '../firebase'

const eggsRef = ref(db, 'eggs')

export function useEggs() {
  const [eggs, setEggs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onValue(eggsRef, (snapshot) => {
      const value = snapshot.val() || {}
      setEggs(Object.entries(value).map(([id, egg]) => ({ id, ...egg })))
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const addEgg = (egg) => push(eggsRef, egg)
  const deleteEgg = (id) => remove(ref(db, `eggs/${id}`))

  return { eggs, addEgg, deleteEgg, loading }
}