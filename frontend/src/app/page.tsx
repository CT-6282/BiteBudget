"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

/**
 * Deletes a menu item by ID.
 * @param {number} id The ID of the menu item to delete.
 */
async function deleteMenu(id: number): Promise<void> {
  const res = await fetch(`http://127.0.0.1:8000/api/menu/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete menu");
  }
  return Promise.resolve();
}

/**
 * Fetches menu data from the server.
 */
async function getData(): Promise<any> {
  const res = await fetch("http://127.0.0.1:8000/api/menu/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

/**
 * Represents a single menu item.
 */
const MenuItem = ({
  id,
  name,
  price,
  onEdit,
  onDelete,
}: {
  id: number;
  name: string;
  price: number;
  onEdit: () => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="menu-item" data-id={id}>
      <div className="menu-item-info">
        <div className="menu-item-name">{name}</div>
        <div className="menu-item-price">${price.toFixed(2)}</div>
      </div>
      <div className="menu-item-actions">
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => {
            deleteMenu(id).then(() => onDelete(id));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [menuItems, setMenuItems] = useState(null);
  const router = useRouter();
  const params = useSearchParams();

  // State for displaying a success message
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "", // either 'add' or 'update'
  });

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setMenuItems(data);
    };
    fetchData().catch(console.error);
  }, []);

  // Detect changes in URL parameters for success messages
  useEffect(() => {
    if (!!params.get("action")) {
      setDisplaySuccessMessage({
        type: params.get("action"),
        show: true,
      });
      router.replace("/");
    }
  }, [params, router]);

  // Automatically hide the success message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displaySuccessMessage.show) {
        setDisplaySuccessMessage({ show: false, type: "" });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [displaySuccessMessage.show]);

  // Handle deletion of a menu item
  const handleDelete = (id) => {
    setMenuItems((items) => items.filter((item) => item.id !== id));
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
        </div>
      </main>
      <div>
        <button className="add-button" onClick={() => router.push("/add")}>
          Add
        </button>
        {displaySuccessMessage.show && (
          <p className="success-message">
            {displaySuccessMessage.type === "add" ? "Added a" : "Modified a"} menu
            item.
          </p>
        )}
        {menuItems ? (
          menuItems.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              onEdit={() => router.push(`/update/${item.id}`)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}