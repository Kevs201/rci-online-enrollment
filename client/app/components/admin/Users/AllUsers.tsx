import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FaPlus } from "react-icons/fa";
import Loader from "../../Loader/Loader";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam: boolean;
};

const Allusers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }

    if (deleteSuccess) {
      refetch();
      toast.success("Deleted user successfully");
      setOpen(false);
    }

    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [updateError, isSuccess, deleteSuccess, deleteError]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "name", headerName: "Name", flex: 0.2 },
    { field: "email", headerName: "Email", flex: 0.2 },
    { field: "role", headerName: "Role", flex: 0.2 },
    { field: "courses", headerName: "Courses", flex: 0.2 },
    { field: "created_at", headerName: "Joined At", flex: 0.2 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpen(true);
            setUserId(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" size={20} />
        </Button>
      ),
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");
    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: formatDate(item.createdAt), // Use custom format here
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: formatDate(item.createdAt), // Use custom format here
        });
      });
  }

  const handleSubmit = async () => {
    if (selectedUserId && role) {
      const userData = { id: selectedUserId, role };
      await updateUserRole(userData);
    }
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-[200px] !flex !gap-2 dark:bg-transparent dark:border-[2px] dark:border-white`}
              onClick={() => setActive(!active)}
            >
              <FaPlus size={20} />
              Add Member
            </div>
          </div>
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {active && (
            <Modal
              open={active}
              onClose={() => setActive(false)}
              aria-labelledby="modal-modal-title"
            >
              <Box
                className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "8px",
                  p: 4,
                  boxShadow: 24,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1 className={`${styles.title} text-center`}>Add New Member</h1>
                <div className="w-full">
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select User</InputLabel>
                    <Select
                      value={selectedUserId || ""}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                      {data?.users.map((user: any) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setActive(false)}
                    className="!border-red-600 !text-red-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white !shadow-none"
                  >
                    Edit user
                  </Button>
                </div>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
            >
              <Box
                className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 dark:bg-slate-700 bg-white"
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "8px",
                  p: 4,
                  boxShadow: 24,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1 className={`${styles.label} text-center text-[18px] font-[00]`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    className="bg-gray-500 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDelete}
                    className="!bg-red-600 !text-white"
                  >
                    Delete
                  </Button>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default Allusers;
