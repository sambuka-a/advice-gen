import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import styles from './app.module.scss'

function App() {
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const adviceRef = useRef(advice)
  adviceRef.current = advice
  const errorRef = useRef(error)
  errorRef.current = error

  const initialized = useRef(false)
  const TIMEOUT_INTERVAL = 500

  const loadAdvice = async () => {
    setLoading(true)
    
    if(advice) setAdvice(null)

    //show an update after timeout
    const timeoutId = setTimeout(() => {
      if (!adviceRef.current && !errorRef.current) {
        setError(new Error("This is taking longer than usual..."))
      }
    }, TIMEOUT_INTERVAL)

    //request
    try {
      const response = await axios.get(`https://api.adviceslip.com/advice`)
      setAdvice(response.data?.slip);
      setLoading(false)
      setError(null)
    } catch (err) {
      setError(err)
      setLoading(false)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  useEffect(() => {
    if(!initialized.current) {
      initialized.current = true

      loadAdvice() 
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {error ? 
          <div className={styles.error}>{error.message}</div> :
          !advice || loading ? <div className={styles.loading}>loading...</div> :
          <>
            <div className={styles.header}>
              advice #{advice.id}
            </div>
            <div className={styles.advice}>
              <span>"{advice.advice}"</span>
            </div>
              <div className={styles.line}>
                <img src='/images/pattern-divider-desktop.svg' alt='divider icon'/>  
            </div>
          </>
        }
      </div>
      <div className={styles.button}>
        <img src='/images/icon-dice.svg' alt='dice icon' onClick={loadAdvice}/>
      </div>
    </div>
  );
}

export default App;
