"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, MenuItem, Button, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  email: string;
  role: string;
  deviceToken: string;
};

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      role: "STUDENT",
      deviceToken: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/${id}/details/user`);
      reset({
        name: res.data.name || "",
        email: res.data.email || "",
        role: res.data.role || "STUDENT",
        deviceToken: res.data.deviceToken || "",
      });
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await axios.patch(`/api/${id}/edit/user`, data);
      toast.success("User berhasil Diupdate 🎉");
      setLoading(false);
      setTimeout(() => {
        router.push("/admin-dashboard#User");
      }, 1500);
    } catch (err) {
      toast.error(`Gagal update User. Err Code : ${err?.response?.status}`);
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className=" p-5">
      <Box className="text-2xl max-w-[80%] mx-auto shadow-md bg-slate-100 p-6 rounded-lg">
        <h1 className="font-bold text-center mb-6">Edit User</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                label="User Name"
                fullWidth
                required
                margin="normal"
                variant="outlined"
                color="info"
                sx={{
                  input: {
                    color: "#0f172a",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f1f5f9",
                    color: "#0f172a",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0f172a",
                  },
                  "& .Mui-disabled": {
                    color: "#0f172a !important",
                  },
                }}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <div {...field} className="my-1 flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input type="text" disabled {...field} className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            )}
          />

          {/* Role */}
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Role"
                fullWidth
                margin="normal"
                variant="outlined"
                color="info"
                sx={{
                  input: {
                    color: "#0f172a",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f1f5f9",
                    color: "#0f172a",
                  },
                }}
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="TEACHER">Teacher</MenuItem>
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="deviceToken"
            render={({ field }) => (
              <div {...field} className="my-1 flex flex-col gap-2">
                <label htmlFor="deviceToken" className="text-sm font-medium text-gray-700">
                  Device Token
                </label>
                <input type="text" {...field} className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            )}
          />

          {/* Submit Button */}
          <Box mt={3}>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="info"
              disabled={loading || isSubmitting}
              startIcon={loading || isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ fontWeight: "bold", borderRadius: 2 }}
            >
              {loading || isSubmitting ? "Updating..." : "Update User"}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
}
