import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTheme } from "next-themes";
import { AiOutlineMail } from "react-icons/ai";
import { useGetALLOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import * as XLSX from "xlsx"; // Importing the xlsx library
import { useDeleteOrderMutation } from "@/redux/features/orders/ordersApi"; // Import the delete order mutation
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import Link from "next/link";  // Import Link for routing
import Loader from "../../Loader/Loader";
import { debounce } from "lodash";  // Import debounce for search optimization

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const { isLoading, data } = useGetALLOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: courseData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Add state for filter by status
  const [deleteOrder] = useDeleteOrderMutation(); // Hook for delete order
  const [loadingExport, setLoadingExport] = useState(false); // State for export loading

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (data && courseData) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );

        const course = courseData?.courses.find(
          (course: any) => course._id === item.courseId
        );

        const fullName = `${item.fName} ${item.mName} ${item.lName}`;
        const address = `${item.street}, ${item.city}, ${item.btgy}`;
        const oldSchool = item.school;
        const courseTitle = course ? course.name : "Course not found";

        return {
          ...item,
          userName: fullName,
          userEmail: user?.email,
          title: courseTitle,
          profileImage: item.profileImage?.url,
          age: item.age,
          bday: item.bday,
          gender: item.gender,
          address: address,
          oldSchool: oldSchool,
          created_at: item.createdAt,
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, courseData]);

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
  }, 300); // Adjust debounce delay as needed

  // Filter rows based on the search term and status
  const filteredRows = orderData.filter((row: any) => {
    const rowData = Object.values(row).join(" ").toLowerCase();
    const matchesSearchTerm = rowData.includes(searchTerm.toLowerCase());

    // Filter by status as well
    const matchesStatus =
      statusFilter === "all" || row.status === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    {
      field: "profileImage",
      headerName: "Profile Image",
      renderCell: (params: any) => (
        <img
          src={params.value}
          alt="Profile"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
      flex: 0.4,
    },
    { field: "age", headerName: "Age", flex: 0.4 },
    { field: "bday", headerName: "Birthday", flex: 0.5 },
    { field: "gender", headerName: "Gender", flex: 0.5 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "oldSchool", headerName: "Old School", flex: 1 },
    { field: "created_at", headerName: "Date of Enroll", flex: 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    {
      field: "status",
      headerName: "Status",
      renderCell: (params: any) => {
        let statusColor = "";

        switch (params.value) {
          case "approved":
            statusColor = "green";
            break;
          case "pending":
            statusColor = "blue";
            break;
          case "canceled":
            statusColor = "red";
            break;
          default:
            statusColor = "gray";
        }

        return (
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {params.value}
          </span>
        );
      },
      flex: 0.5,
    },
    {
      field: "viewStudent",
      headerName: "View Student Data",
      renderCell: (params: any) => {
        return (
          <Link href={`/admin/view-student/${params.row.id}`} passHref>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#3e4396",
                color: "#fff",
                "&:hover": { backgroundColor: "#333b80" },
              }}
            >
              View
            </Button>
          </Link>
        );
      },
      flex: 0.3,
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params: any) => {
        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteClick(params.row.id)}
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#e57373",
              },
            }}
          >
            <MdDeleteOutline className="text-[25px] text-red-800 dark:text-white" />
          </Button>
        );
      },
      flex: 0.3,
    },
  ];

  const rows: any = [];

  filteredRows.forEach((item: any) => {
    rows.push({
      id: item._id,
      userName: item.userName,
      userEmail: item.userEmail,
      age: item.age,
      bday: new Date(item.bday).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),     
      gender: item.gender,
      address: item.address,
      oldSchool: item.oldSchool,
      profileImage: item.profileImage,
      created_at: new Date(item.created_at).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      title: item.title,
      status: item.status,  // Adding status here
    });
  });

  // Export to Excel function
  const exportToExcel = () => {
    setLoadingExport(true); // Start loading
    const worksheet = XLSX.utils.json_to_sheet(rows); // Convert rows data to sheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders"); // Append the sheet to workbook

    // Write and download the Excel file
    XLSX.writeFile(workbook, "all_invoices.xlsx");
    setLoadingExport(false); // Stop loading
  };

  // Handle the delete button click
  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setOpenDialog(true); // Open the confirmation dialog
  };

  // Handle confirmation of delete
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete); // Call the delete mutation
      toast.success("Order deleted successfully!");
      // Remove the order from the state immediately (optimistic UI update)
      setOrderData(orderData.filter((order: any) => order._id !== orderToDelete));
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
      setOpenDialog(false); // Close the dialog on error
    }
  };

  // Handle cancel of delete
  const handleCancelDelete = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          {/* Filter buttons */}
          <Box mb={2}>
            <Button
              variant={statusFilter === "all" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setStatusFilter("all")}
              sx={{ marginRight: "10px" }}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "approved" ? "contained" : "outlined"}
              color="success"
              onClick={() => setStatusFilter("approved")}
              sx={{ marginRight: "10px" }}
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === "pending" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setStatusFilter("pending")}
              sx={{ marginRight: "10px" }}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "canceled" ? "contained" : "outlined"}
              color="error"
              onClick={() => setStatusFilter("canceled")}
              sx={{ marginRight: "10px" }}
            >
              Canceled
            </Button>
          </Box>

          {/* Search Bar */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Search Student.."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  borderColor: theme === "dark" ? "#fff" : "#000",
                  color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiInputLabel-root": {
                  color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "#fff" : "#000",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "#fff" : "#000",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "#fff" : "#000",
                },
              }}
            />
          </Box>

          {/* Export to Excel Button */}
          <Box mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={exportToExcel}
              disabled={loadingExport}
              sx={{
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                color: theme === "dark" ? "#fff" : "#000",
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#333b80" : "#7f88f5",
                },
              }}
            >
              {loadingExport ? "Exporting..." : "Export to Excel"}
            </Button>
          </Box>

          <Box
            m={isDashboard ? "0" : "40px 0 0 0 "}
            height={isDashboard ? "35vh" : "90vh"}
            overflow={"hidden"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard ? false : true}
              rows={rows}
              columns={columns}
            />
          </Box>

          {/* Confirmation Dialog */}
          <Dialog open={openDialog} onClose={handleCancelDelete}>
            <DialogTitle
              sx={{
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                color: theme === "dark" ? "#fff" : "#000",
                textAlign: "center",
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AiOutlineMail className="text-3xl text-red-600" />
                <Box sx={{ marginLeft: "15px" }}>
                  <h3 style={{ color: "#555" }}>Are you sure you want to delete this order?</h3>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
