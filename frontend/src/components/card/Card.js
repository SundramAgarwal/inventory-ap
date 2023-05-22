import React from 'react';
import styles from "./Card.module.css"

const Card = ({children, cardClass}) => {
  return (
/* We can see the content that is written inside Card tags in login.js
has reached the Card.js component through the prop 'children'. */
    <div className={`${styles.card} ${cardClass}`}>
        {children}
    </div>
  )
}

export default Card;