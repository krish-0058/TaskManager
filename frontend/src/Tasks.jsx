import { useEffect, useState } from "react";
import { Check, X, ImagePlus, Upload, Trash2, Pencil, LogOut, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "./supabase-client";


export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigate = useNavigate();







  // Getting User
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return;
      }

      setUser(data.user);
    };

    fetchUser();
  }, []);















  // Fetching Tasks
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setTasks(data);
      }
    };

    fetchData();

  }, []);















  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          const newTask = payload.new;

          setTasks((prev) => {
            if (prev.some((task) => task.id === newTask.id)) {
              return prev;
            }

            return [...prev, newTask];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);















  // Image Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };















  // Upload Image
  const uploadImage = async (file) => {
    const filePath = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("task-image")
      .upload(filePath, file);

    if (error) {
       return
    }

    const { data } = supabase.storage
      .from("task-image")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };















  // Submit Task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = existingImage;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      if (editingId !== null) {
  
        const { error } = await supabase
          .from("tasks")
          .update({
            title: title.trim(),
            description: description.trim() || "No description provided.",
            image_url: imageUrl,
          })
          .eq("id", editingId);

        if (error) throw error;

        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingId
              ? {
                  ...task,
                  title: title.trim(),
                  description:
                    description.trim() || "No description provided.",
                  image_url: imageUrl,
                }
              : task
          )
        );

        setEditingId(null);
      } else {
        const newTask = {
          title: title.trim(),
          description: description.trim() || "No description provided.",
          email: user.email,
          image_url: imageUrl,
        };

        const { error } = await supabase
          .from("tasks")
          .insert(newTask);

        if (error) throw error;
      }

      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };















  // Edit Task
  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setExistingImage(task.image_url);
    setImage(null);
    setImagePreview(task.image_url || null);
    setError("");
  };















  // Reset Form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setExistingImage(null);
    setEditingId(null);
    setError("");
  };















  // Cancel Edit
  const handleCancelEdit = () => {
    resetForm();
  };















  // Delete Task
  const handleDeleteTask = async (id) => {
  // 1. Get image URL
  const { data, error: fetchError } = await supabase
    .from("tasks")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    return;
  }


  // 2. Delete image if it exists
  if (data.image_url) {
    const filePath = decodeURIComponent(
      new URL(data.image_url).pathname.split("/task-image/")[1]
    );



    const { error: imageDeletionError } =
      await supabase.storage
        .from("task-image")
        .remove([filePath]);


    if (imageDeletionError) {
      setError(imageDeletionError.message);
      return;
    }
  }

  // 3. Delete task
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    setError(error.message);
    return;
  }

  setTasks((prev) => prev.filter((task) => task.id !== id));

  if (editingId === id) {
    resetForm();
  }
};














  // Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error)
    } else {
      navigate("/auth");
    }
  };



















 



  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100 font-sans">

      {/* Header */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-5 lg:px-8">
    <h1 className="text-xl font-bold tracking-tight">
      Task<span className="text-orange-500">Manager</span>
    </h1>

    <div className="flex items-center gap-5">

      <Link
        to="/reset-password"
        title="Reset Password"
        className="text-zinc-400 hover:text-orange-500 transition"
      >
        <KeyRound size={18} />
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </button>

    </div>
  </header>

      {/* Main Layout */}
      <main className="max-w-[1800px] mx-auto p-3 lg:p-5">

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.7fr] gap-4">

          {/* LEFT SIDE - CREATE / EDIT TASK */}
          <section className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-5 lg:p-6 h-fit">

            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Task" : "Create a Task"}
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                {editingId
                  ? "Update your task details."
                  : "Add a new task to your list."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >

              {/* Error */}
              {error && (
                <div className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Task Title
                </label>

                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#111111] border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Description
                </label>

                <textarea
                  placeholder="Describe your task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-[#111111] border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 resize-y transition"
                />
              </div>

              {/* Image Upload */}
              <div>
    <label className="block text-sm text-zinc-400 mb-2">
      Task Image
    </label>

    <label
      htmlFor="task-image"
      className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-700 hover:border-orange-500 rounded-xl h-48 cursor-pointer bg-[#111111] transition overflow-hidden"
    >
      {imagePreview ? (
        <>
          {/* Image Preview inside the upload box */}
          <img
            src={imagePreview}
            alt="Task preview"
            className="w-full h-full object-contain bg-zinc-900"
          />

          {/* Remove Image Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setImage(null);
              setImagePreview(null);
              setExistingImage(null);
            }}
            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 p-2 rounded-lg transition z-10"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
            <ImagePlus className="text-orange-500" size={24} />
          </div>

          <div className="text-center">
            <p className="text-base text-zinc-300">
              Click to upload an image
            </p>

            <p className="text-xs text-zinc-500 mt-1">
              PNG, JPG, JPEG
            </p>
          </div>
        </>
      )}

      <input
        id="task-image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm transition cursor-pointer"
                >
                  {loading ? (
                    "Saving..."
                  ) : editingId ? (
                    <>
                      <Check size={17} />
                      Update Task
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Add Task
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-400 transition"
                  >
                    <X size={18} />
                  </button>
                )}

              </div>
            </form>
          </section>

          {/* RIGHT SIDE - TASK VIEWING */}
          <section className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden min-w-0">

            {/* Task Header */}
            <div className="flex items-center justify-between p-4 lg:p-5 border-b border-zinc-800">

              <div>
                <h2 className="text-xl font-semibold">
                  Your Tasks
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Manage all your tasks here.
                </p>
              </div>

              <div className="bg-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm">
                {tasks.length} Tasks
              </div>
            </div>

            {/* SCROLLABLE TASK AREA */}
            <div className="h-fit min-h-[300px] max-h-[calc(100vh-150px)] overflow-y-auto p-3 lg:p-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">

              {tasks.length === 0 ? (
                <div className="min-h-[500px] flex flex-col items-center justify-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-3">
                    <ImagePlus size={28} className="text-zinc-500" />
                  </div>

                  <h3 className="text-zinc-300 font-medium">
                    No tasks yet
                  </h3>

                  <p className="text-sm text-zinc-500 mt-2">
                    Create your first task using the form.
                  </p>

                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">

                  {tasks.map((task) => (
                    <article
                      key={task.id}
                      className={`flex items-stretch gap-4 bg-[#222222] border rounded-xl p-4 min-h-[250px] transition ${
                        editingId === task.id
                          ? "border-orange-500/60"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >

                      {/* Task Content - LEFT */}
                      <div className="flex-1 min-w-0 flex flex-col py-1">

                        <h3 className="text-xl font-semibold text-zinc-100 break-words">
                          {task.title}
                        </h3>

                        <p className="text-base text-zinc-400 mt-3 whitespace-pre-wrap break-words leading-relaxed">
                          {task.description}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 mt-auto pt-5">

                          <button
                            onClick={() => handleEditClick(task)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition cursor-pointer"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                              onClick={() => {
                                setSelectedTaskId(task.id);
                                setShowDeleteModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-400 rounded-lg text-sm transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>


                            {showDeleteModal && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

                                <div className="w-full max-w-sm bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">

                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-red-500/10 rounded-xl">
                                      <Trash2 size={22} className="text-red-500" />
                                    </div>

                                    <h2 className="text-lg font-semibold text-white">
                                      Delete Task?
                                    </h2>
                                  </div>

                                  <p className="text-sm text-zinc-400 mb-7">
                                    Are you sure you want to delete this task? This action cannot be undone.
                                  </p>

                                  <div className="flex justify-end gap-3">

                                    <button
                                      onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedTaskId(null);
                                      }}
                                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition cursor-pointer"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      onClick={() => {
                                        handleDeleteTask(selectedTaskId);
                                        setShowDeleteModal(false);
                                        setSelectedTaskId(null);
                                      }}
                                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition cursor-pointer"
                                    >
                                      Yes, Delete
                                    </button>

                                  </div>
                                </div>
                              </div>
                            )}

                        </div>
                      </div>

                      {/* Task Image - RIGHT */}
                      <div className="w-[48%] h-[220px] shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">

                        {task.image_url ? (
                          <img
                            src={task.image_url}
                            alt={task.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <p className="text-sm text-zinc-500 text-center px-3">
                            No image provided
                          </p>
                        )}

                      </div>

                    </article>
                  ))}

                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}