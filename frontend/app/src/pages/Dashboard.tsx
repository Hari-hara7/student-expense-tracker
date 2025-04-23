import { useEffect, useState } from "react";
import API from "../services/api";
import ExpenseCard from "../components/ExpenseCard";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });

  const monthlyBudget = 5000; 
  const monthlySpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const formatted = res.data.map((expense: any) => ({
        ...expense,
        amountFormatted: `₹${expense.amount.toFixed(2)}`,
      }));
      setExpenses(formatted);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) return;
    await API.post("/expenses", { ...form, amount: Number(form.amount) });
    setForm({ title: "", amount: "", category: "" });
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Add New Expense</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition font-medium"
        >
          Add Expense
        </button>
      </form>

    
      {monthlyBudget - monthlySpent <= 100 && (
        <div className="mb-6 px-4 py-3 bg-red-100 text-red-700 rounded-md text-sm font-semibold">
          ⚠️ Warning: Your monthly balance is below ₹100. Manage your expenses wisely!
        </div>
      )}

    
      <div className="grid gap-4">
        {expenses.map((expense) => (
          <ExpenseCard key={expense._id} {...expense} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
