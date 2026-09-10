import toast from 'react-hot-toast';

export function confirmToast(message: string, onConfirm: () => void) {
  toast.custom(
    t => (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-lg px-5 py-4 flex flex-col gap-3 w-80 transition-all ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <p className="text-sm font-medium text-gray-800">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { toast.dismiss(t.id); onConfirm(); }}
            className="px-3 py-1.5 text-xs font-semibold text-white rounded transition-colors"
            style={{ background: '#dc2626' }}
          >
            Delete
          </button>
        </div>
      </div>
    ),
    { duration: Infinity, position: 'top-center' }
  );
}
