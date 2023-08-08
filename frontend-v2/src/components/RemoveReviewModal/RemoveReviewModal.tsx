"use client";

import { Review } from "@/types/api";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { del } from "@/utils/request";

export default function RemoveReviewModal({
  review,
  setDeleted,
}: {
  review: Review;
  setDeleted: (reviewId: string) => void;
}) {
  // States
  const [isOpen, setIsOpen] = useState(false);

  // function to close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // function to open modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Remove review
  const removeReview = async () => {
    await del(`/reviews/${review.reviewId}`);
    setDeleted(review.reviewId);
    closeModal();
  };

  return (
    <>
      {/* Modal */}
      <div className="isolate">
        {/* Add Review button */}
        <button onClick={openModal} className="duration-100 hover:text-red-500">
          <TrashIcon className="w-6 h-6 inline-block" />
        </button>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Dark background behind modal */}
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="transform overflow-hidden rounded-md text-left align-middle shadow-xl transition-all bg-unilectives-modal px-12 py-8 space-y-5 isolate">
                    {/* Modal title */}
                    <Dialog.Title as="h1" className="text-2xl font-bold">
                      Delete Your Review
                    </Dialog.Title>
                    <hr className="border-black/25" />
                    <p>Are you sure you want to delete your review?</p>
                    <div className="flex flex-wrap items-center justify-between">
                      <button
                        className="px-4 py-2 rounded-md text-white font-bold bg-unilectives-subheadings/75 duration-100 hover:bg-unilectives-subheadings/50"
                        type="button"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-white font-bold bg-unilectives-button duration-100 hover:bg-unilectives-button/75"
                        type="button"
                        onClick={() => removeReview()}
                      >
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}
