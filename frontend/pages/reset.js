import Reset from '../components/Reset';

const Sell = ({ query }) => (
  <div>
    <p>Reset Your Password {query.resetToken}</p>
    <Reset resetToken={query.resetToken} />
  </div>
);

export default Sell;
