import React from "react";
import ProductList from "./components/ProductList";
import SellButton from "./components/SellButton";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex-grow pb-16">
        <ProductList />
      </section>
      <div className="fixed bottom-24 right-5">
        <SellButton />
      </div>
    </main>
  );
}
