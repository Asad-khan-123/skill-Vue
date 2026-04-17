import { useState, useEffect } from "react";
import {
  SearchIcon,
  ReceiptTextIcon,
  CheckCircleIcon,
  FilterIcon,
  WalletIcon,
  XIcon,
  Loader2Icon,
  FileTextIcon,
} from "lucide-react";
import api from "../api.js";
import FeePrintable from "../components/FeePrintable.jsx";

const Fees = () => {
  const [activeBatch, setActiveBatch] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batches, setBatches] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal Forms
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [collecting, setCollecting] = useState(false);

  // Fee Slip State
  const [feeSlipData, setFeeSlipData] = useState(null);
  const [loadingSlip, setLoadingSlip] = useState(false);
  const [coachingName, setCoachingName] = useState(
    localStorage.getItem("coachingName") || "UMA Coaching Classes",
  );

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get("/batches");
        if (data.success) {
          setBatches(data.batches);
        }
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    fetchBatches();
  }, []);

  const fetchPendingFees = async () => {
    setLoading(true);
    try {
      const query = activeBatch !== "All" ? `?batch=${activeBatch}` : "";
      const { data } = await api.get(`/fees/pending${query}`);
      if (data.success) {
        setFeeRecords(data.students);
      }
    } catch (err) {
      console.error("Failed to fetch pending fees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFees();
  }, [activeBatch]);

  const handleCollectFee = async (e) => {
    e.preventDefault();
    setCollecting(true);
    try {
      const payload = {
        studentId: selectedStudent._id,
        amountPaid: Number(amountPaid),
        paymentMode,
        remarks,
      };
      const { data } = await api.post("/fees/collect", payload);
      if (data.success) {
        alert("Fee Collected Successfully!");
        setSelectedStudent(null);
        fetchPendingFees(); // Refresh the datatable
      }
    } catch (err) {
      console.error("Failed to collect fee", err);
      alert(err.response?.data?.message || "Failed to collect fee");
    } finally {
      setCollecting(false);
    }
  };

  const openCollectModal = (student) => {
    setSelectedStudent(student);
    // For installment-based, maybe don't prefill whole amount if it's huge
    setAmountPaid("");
    setPaymentMode("Cash");
    setRemarks("");
  };

  const handleGenerateFeePrintable = async (student) => {
    setLoadingSlip(true);
    try {
      const { data } = await api.get(`/fees/student/${student._id}`);
      if (data.success) {
        setFeeSlipData(data.ledger);
      }
    } catch (err) {
      console.error("Failed to fetch fee ledger", err);
      alert(err.response?.data?.message || "Failed to generate fee slip");
    } finally {
      setLoadingSlip(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fee Collection</h1>
          <p className="text-gray-500 mt-1">
            Track dues and collect installments for the Yearly Course Fee.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <WalletIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">
              Total Dues Pending
            </p>
            <p className="text-lg font-bold text-gray-800 tracking-tight">
              ₹{" "}
              {feeRecords
                .reduce((acc, curr) => acc + curr.totalDues, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col gap-4">
          {/* Batch Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveBatch("All")}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeBatch === "All"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Students
            </button>
            {batches.map((batch) => (
              <button
                key={batch._id}
                onClick={() => setActiveBatch(batch._id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeBatch === batch._id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {batch.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fees Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2Icon className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Total Fees</th>
                  <th className="px-6 py-4 font-medium text-right">Paid</th>
                  <th className="px-6 py-4 font-medium text-right font-bold text-gray-800">
                    Remaining
                  </th>
                  <th className="px-6 py-4 font-medium text-center">
                    Installment Status
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feeRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <h3 className="font-semibold text-gray-800">
                        {record.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {record.studentId}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-sm font-medium">
                      ₹ {record.totalCourseFee}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-bold text-sm">
                      ₹ {record.paidAmount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold ${record.totalDues > 0 ? "text-red-500" : "text-green-500"}`}
                      >
                        ₹ {record.totalDues}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-md border ${
                          record.totalDues === 0
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }`}
                      >
                        {record.totalDues === 0 ? "Fully Paid" : "Outstanding"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        <button
                          onClick={() => handleGenerateFeePrintable(record)}
                          disabled={loadingSlip}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
                        >
                          {loadingSlip ? (
                            <Loader2Icon size={14} className="animate-spin" />
                          ) : (
                            <FileTextIcon size={14} />
                          )}
                          Fee Slip
                        </button>
                        <button
                          onClick={() => openCollectModal(record)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
                        >
                          <WalletIcon size={14} />
                          Collect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Fee Slip Modal */}
      {feeSlipData && (
        <FeePrintable
          ledger={feeSlipData}
          coachingName={coachingName}
          onClose={() => setFeeSlipData(null)}
        />
      )}

      {/* Collect Fee Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => !collecting && setSelectedStudent(null)}
          />
          <form
            onSubmit={handleCollectFee}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative z-10 animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  New Installment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent.name} • Course Fee: ₹
                  {selectedStudent.totalCourseFee}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !collecting && setSelectedStudent(null)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XIcon size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex-1">
                  <p className="text-[10px] font-bold text-green-700 uppercase">
                    Paid So Far
                  </p>
                  <p className="text-lg font-bold text-green-800">
                    ₹ {selectedStudent.paidAmount}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex-1">
                  <p className="text-[10px] font-bold text-red-700 uppercase">
                    Balance Due
                  </p>
                  <p className="text-lg font-bold text-red-800">
                    ₹ {selectedStudent.totalDues}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Installment Amount (₹)
                  </label>
                  <input
                    max={selectedStudent.totalDues}
                    min={1}
                    required
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    type="number"
                    placeholder="Enter amount..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-xl text-blue-600 placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Cash", "UPI"].map((mode) => (
                      <label
                        key={mode}
                        className={`border rounded-xl p-3 flex items-center justify-center cursor-pointer font-bold transition-all ${paymentMode === mode ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-50" : "border-gray-200 text-gray-500"}`}
                      >
                        <input
                          type="radio"
                          checked={paymentMode === mode}
                          onChange={() => setPaymentMode(mode)}
                          className="sr-only"
                        />
                        <span>{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Remarks / Month Tag
                  </label>
                  <input
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    type="text"
                    placeholder="e.g. April 2nd Installment"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-2xl">
              <button
                type="submit"
                disabled={collecting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                {collecting ? (
                  <Loader2Icon size={18} className="animate-spin" />
                ) : (
                  <CheckCircleIcon size={18} />
                )}
                <span>Save Payment</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Fees;
