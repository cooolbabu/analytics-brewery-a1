function page() {
  return (
    <div className="border rounded-lg border-red-600">
      <h1 className="text-2xl font-bold text-red-600">Hello World</h1>
      <p className="text-red-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod voluptatum et voluptatibus ipsam minus eveniet
        necessitatibus debitis fugiat modi aspernatur, architecto, consequatur animi fugit velit, aut ducimus alias
        magni! Molestias.
      </p>
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
