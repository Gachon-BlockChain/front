import React from "react";
import CategoryBar from "./components/CategoryBar";
import ProductList from "./components/ProductList";
import SellButton from "./components/SellButton";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex-grow pb-16">
        <CategoryBar />
        <ProductList />
      </section>
      <div className="fixed bottom-24 right-5">
        <SellButton />
      </div>
    </main>
  );
}
