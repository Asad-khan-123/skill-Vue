import { useRef } from "react";
import { PrinterIcon, DownloadIcon, XIcon } from "lucide-react";
import html2pdf from "html2pdf.js";

const FeePrintable = ({ ledger, coachingName, onClose }) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `fee-slip-${ledger.student.studentId}-${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const totalPaid = ledger.payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const remainingDue = ledger.student.totalCourseFee - totalPaid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Fee Slip</h2>
            <p className="text-blue-100 text-sm mt-1">{coachingName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Printable Content */}
        <div ref={printRef} className="p-8 bg-white">
          <style>{`
                  @media print {
                     body {
                        margin: 0;
                        padding: 0;
                     }
                     .no-print {
                        display: none;
                     }
                  }
               `}</style>

          {/* Coaching Header */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-gray-800">{coachingName}</h1>
            <p className="text-sm text-gray-600 mt-2">Fee Slip</p>
            <p className="text-xs text-gray-500 mt-3">
              Generated on: {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Student Name
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {ledger.student.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Student ID
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {ledger.student.studentId}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Batch
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {ledger.student.batch?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {ledger.student.email}
              </p>
            </div>
          </div>

          {/* Fee Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
              Fee Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Course Fee:</span>
                <span className="font-bold text-gray-900">
                  ₹ {ledger.student.totalCourseFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span>Amount Paid:</span>
                <span className="font-bold">
                  ₹ {totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-red-600">
                <span className="font-semibold">Amount Due:</span>
                <span className="font-bold text-lg">
                  ₹ {remainingDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
              Payment History
            </h3>
            {ledger.payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-2 font-bold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 font-bold text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 font-bold text-gray-700">
                        Mode
                      </th>
                      <th className="text-left py-3 px-2 font-bold text-gray-700">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.payments.map((payment, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-2 text-gray-700">
                          {new Date(payment.datePaid).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 font-semibold text-green-600">
                          ₹ {payment.amountPaid.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-gray-700">
                          {payment.paymentMode}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {payment.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No payments recorded yet
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>
              This is a system-generated fee slip. Please retain for your
              records.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 rounded-b-2xl flex gap-3 justify-end no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <PrinterIcon size={18} />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <DownloadIcon size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeePrintable;
