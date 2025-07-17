import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthUser from "../../hooks/useAuthUser";
// import useAuthUser from "../../hooks/useAuthUser";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const queryClient = useQueryClient();
   const { data: authUser } =useAuthUser();

  const imgRef = useRef(null);

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        // Check if caption is empty
        const formData = new FormData();
        formData.append("image", imgRef.current.files[0]);
        formData.append("caption", caption);
        const res = await fetch("/api/posts/create", {
          method: "POST",
          credentials: "include", // Include cookies in the request
          headers: {
            "Content-Type": "application/json",
          },
          body: formData,
          
        });
        const data = await res.json();
        // Check if the response is ok
        if (!data || !data.newPost) {
          throw new Error("Failed to create post");
        }
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setCaption("");
      setImage(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ caption, image });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profilePicture || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {image && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImage(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={image}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};
export default CreatePost;
