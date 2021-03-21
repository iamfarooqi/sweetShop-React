import React from 'react';
// import '../Dashboard.css'
export default function Product(props) {
  const { product, onAdd } = props;
  return (
    <div>
      <img className="w-100" height="200" src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <div>{product.price}Pkr</div>
      <div>
        <button onClick={() => onAdd(product)} className="btn btn-primary">Add To Cart</button>
      </div>
    </div>
  );
}