"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

/**
 * Fetches a menu item by ID.
 * @param {number} id The ID of the menu item to retrieve.
 */
async function getMenu(id: number): Promise<any> {
  const res = await fetch(`http://127.0.0.1:8000/api/menu/${id}/`);
  if (!res.ok) {
    throw new Error("Failed to retrieve menu");
  }
  return res.json();
}

/**
 * Updates a menu item by ID.
 * @param {number} id The ID of the menu item to update.
 * @param {Object} data The updated data for the menu item.
 */
async function updateMenu(id: number, data: Record<string, any>): Promise<any> {
  const res = await fetch(`http://127.0.0.1:8000/api/menu/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update menu");
  }
  return res.json();
}

interface PageProps {
  params: Promise<{
    menuId: number;
  }>;
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unwrappedParams = use(params);

  /**
   * Handles form submission.
   * @param {FormEvent} event The form submission event.
   */
  const onFinish = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    updateMenu(unwrappedParams.menuId, formData)
      .then(() => {
        router.replace("/?action=update");
      })
      .catch(() => {
        setError("An error occurred");
        setIsLoading(false);
      });
  };

  // Cleanup effect for resetting loading state
  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  // Fetch menu item data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMenu(unwrappedParams.menuId);
        setFormData({ name: data.name, price: data.price });
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchData();
  }, [unwrappedParams.menuId]);

  return (
    <form onSubmit={onFinish}>
      <div className="form-item">
        <label htmlFor="name">Name</label>
        <input
          required
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="form-item">
        <label htmlFor="price">Price</label>
        <input
          required
          type="number"
          name="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div>
        <button disabled={isLoading} className="add-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Page;