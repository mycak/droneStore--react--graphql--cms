import React from 'react';
import Link from'next/link';

const Home = (props) => {
  console.log(props)
  return (
    <div>
      <p>Mycha</p>
      <Link href="/sell" ><a>esa</a></Link>
    </div>
  );
};

export default Home;