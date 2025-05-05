import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ Import js-cookie

// Define the base API URL
const API_BASE_URL = "https://learning-management-system-o8nu.onrender.com/api/exams";

// ✅ Function to check if the token is valid
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload.exp * 1000 > Date.now(); // Check if expired
  } catch (error) {
    return false;
  }
};

// ✅ Get token from cookies
const getToken = () => {
  const token = Cookies.get("token");
  return token && isTokenValid(token) ? token.trim() : null;
};

// ✅ Fetch all exams (Accessible by trainers & examinees)
export const fetchExams = createAsyncThunk(
  "exam/fetchExams",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Ensures cookies are sent
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch exams");
    }
  }
);

// ✅ Create Exam (Only trainers can access)
export const createExam = createAsyncThunk(
  "exam/createExam",
  async (examData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(`${API_BASE_URL}/create`, examData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create exam");
    }
  }
);

// ✅ Add Questions to an Exam (Only trainers can access)
export const addQuestions = createAsyncThunk(
  "exam/addQuestions",
  async ({ examId, questions }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(
        `${API_BASE_URL}/add-questions`,
        { examId, questions },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add questions");
    }
  }
);

// ✅ Delete an Exam (Only trainers or admin can delete)
export const deleteExam = createAsyncThunk(
  "exam/deleteExam",
  async (examId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.delete(`${API_BASE_URL}/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return { examId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete exam");
    }
  }
);

// ✅ Delete a Question (Only trainers or admin can delete)
export const deleteQuestion = createAsyncThunk(
  "exam/deleteQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.delete(
        `${API_BASE_URL}/questions/${questionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return { questionId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete question"
      );
    }
  }
);
// ✅ Fetch Questions for a Specific Exam (Trainers & Examinees)
// ✅ Fetch a single exam's questions
export const fetchExamQuestions = createAsyncThunk(
  "exam/fetchExamQuestions",
  async (examId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/${examId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return { examId, questions: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch questions");
    }
  }
);

// ✅ Enroll in an Exam (Learners & Examinees)
export const enrollExam = createAsyncThunk(
  "exam/enrollExam",
  async (examId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(
        `${API_BASE_URL}/enroll/${examId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to enroll in exam");
    }
  }
);

// ✅ Fetch Enrolled Exams for a User
export const fetchEnrolledExams = createAsyncThunk(
  "exam/fetchEnrolledExams",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/enrolledExam`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return response.data.enrolledExams;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch enrolled exams");
    }
  }
);
// ✅ Submit Exam Result
export const submitResult = createAsyncThunk(
  "exam/submitResult",
  async (resultData, { rejectWithValue }) => {
    try {
      const token = getToken(); // ✅ Ensure token is fetched correctly
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(
        `${API_BASE_URL}/submit-result`, // ✅ Correct URL
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ Important
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error submitting result:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to submit result");
    }
  }
);



// ✅ Fetch Results for a User
export const fetchResults = createAsyncThunk(
  "exam/fetchResults",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Unauthorized - Please log in to view results.");
      }

      const response = await axios.get(`${API_BASE_URL}/submitted-results`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Only needed if backend uses cookies
      });


      // ✅ Return results correctly
      return response.data;
    } catch (error) {
      // ✅ Proper error handling
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch results"
      );
    }
  }
);
// ✅ Fetch Created Exams (Only Trainers & Admins)
export const fetchCreatedExams = createAsyncThunk(
  "exam/fetchCreatedExams",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/created-exams`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (!response.data || response.data.length === 0) {
        return rejectWithValue("No exams found.");
      }

      return response.data; // ✅ Ensure backend returns correct structure
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch created exams");
    }
  }
);

// ✅ Generate Certificate for Passed Students
export const generateCertificate = createAsyncThunk(
  "exam/generateCertificate",
  async (examId, { rejectWithValue }) => {
    try {
      console.log("Token before request:", getToken());
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token found");

      const response = await axios.get(`${API_BASE_URL}/${examId}/certificate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Ensure cookies are sent if required

      });

      if (!response.data.success) throw new Error(response.data.message);

      // ✅ Open the certificate URL in a new tab
      window.open(response.data.certificateUrl, "_blank");

      return { success: true, message: "Certificate opened successfully." };
    } catch (error) {
      console.error("Certificate Generation Error:", error);
      return rejectWithValue(error.response?.data || "Failed to generate certificate");
    }
  }
);

// ✅ Update Exam (Only trainers can access)
export const updateExam = createAsyncThunk(
  "exam/updateExam",
  async ({ examId, updatedData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.put(
        `${API_BASE_URL}/update-exam/${examId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update exam");
    }
  }
);

// ✅ Update Question (Only trainers can access)
export const updateQuestion = createAsyncThunk(
  "exam/updateQuestion",
  async ({ questionId, updatedData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.put(
        `${API_BASE_URL}/update-question/${questionId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update question"
      );
    }
  }
);



// ✅ Exam Slice
const examSlice = createSlice({
  name: "exam",
  initialState: {
    exams: [],
    enrolledExams: [],
    results: [], // ✅ Store results
    createdExams: [],
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Exams
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // Create Exam
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createExam.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // Add Questions
      .addCase(addQuestions.fulfilled, (state, action) => {
        const { examId, questions } = action.payload;
        const updatedExam = state.exams.find((exam) => exam._id === examId);
        if (updatedExam) {
          updatedExam.questions = [...updatedExam.questions, ...questions]; // ✅ Fix updating questions
        }
      })

      .addCase(addQuestions.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Questions for a Specific Exam
      .addCase(fetchExamQuestions.fulfilled, (state, action) => {
        const { examId, questions } = action.payload;
        const exam = state.exams.find((e) => e._id === examId);
        if (exam) {
          exam.questions = questions; // ✅ Ensure questions are stored
        }
        state.status = "succeeded";
      })
      .addCase(fetchExamQuestions.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(enrollExam.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(enrollExam.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // ✅ Fetch Enrolled Exams
      .addCase(fetchEnrolledExams.fulfilled, (state, action) => {
        state.enrolledExams = action.payload; // Store enrolled exams
        state.status = "succeeded";
      })
      .addCase(fetchEnrolledExams.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(submitResult.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(submitResult.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // ✅ Fetch Results
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload; // ✅ Ensure correct data assignment
      })

      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCreatedExams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreatedExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload; // ✅ Store created exams
      })
      .addCase(fetchCreatedExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateCertificate.pending, (state) => {
        state.status = "loading";
        state.certificateUrl = null; // Reset on new request
      })
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.certificateUrl = action.payload?.certificateUrl || null; // Store the URL
      })
      .addCase(generateCertificate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error occurred";
      })
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;
        const updatedExam = action.payload;
        state.exams = state.exams.map((exam) =>
          exam._id === updatedExam._id ? updatedExam : exam
        );
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // ✅ Delete exam
       .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter(
          (exam) => exam._id !== action.payload.examId
        );
      })
      // ✅ Delete question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.exams.forEach((exam) => {
          exam.questions = exam.questions.filter(
            (q) => q._id !== action.payload.questionId
          );
        });
      });
  },
});

export default examSlice.reducer;
