import React from 'react';
import Product from './Product';
import '../Dashboard.css'
export default function Main(props) {
  const { products, onAdd } = props;
  return (
    <main className="container">
      <h1 className="text-center ">Products</h1>
      <div className="row">
        {products.map((product) => (
        <div className="col-md-4" key={product.id}>
          <Product key={product.id} product={product} onAdd={onAdd}/>
        </div>
        ))}
      </div>
    </main>
  );
}