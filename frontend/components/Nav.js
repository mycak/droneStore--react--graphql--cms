import Link from 'next/link';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => (
  <User>
    {(data) => {
      if (data && !data.me) {
        return (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>
            <Link href="/signup">
              <a>Sign In</a>
            </Link>
          </NavStyles>
        );
      }
      return (
        <NavStyles>
          <Link href="/items">
            <a>Shop</a>
          </Link>
          <Link href="/sell">
            <a>Sell</a>
          </Link>
          <Link href="/orders">
            <a>Orders</a>
          </Link>
          <Link href="/me">
            <a>Account</a>
          </Link>
          <Signout />
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
