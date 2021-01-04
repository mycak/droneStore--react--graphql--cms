import Link from 'next/link';
import { useMutation } from '@apollo/client';
import CartCount from './CartCount';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';
import User from './User';
import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => {
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  return (
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
        if (data && data.me) {
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
              <button type="button" onClick={toggleCart}>
                My Cart
                <CartCount
                  count={data.me.cart.reduce(
                    (tally, cartItem) => tally + cartItem.quantity,
                    0
                  )}
                />
              </button>
            </NavStyles>
          );
        }
        return <p />;
      }}
    </User>
  );
};

export default Nav;
