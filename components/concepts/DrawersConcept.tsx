"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ConceptShell } from "./ConceptShell";
import {
  getAllQuestionHubs,
  getFlagshipProject,
  getAllEssays,
} from "@/lib/content";

interface Drawer {
  id: string;
  label: string;
  sublabel: string;
  items: { title: string; href: string; note?: string }[];
}

export function DrawersConcept() {
  const hubs = getAllQuestionHubs();
  const project = getFlagshipProject();
  const essays = getAllEssays();
  const [openId, setOpenId] = useState<string | null>(null);

  const drawers: Drawer[] = [
    {
      id: "chamber",
      label: "The Deep Chamber",
      sublabel: "Flagship inquiry",
      items: [
        {
          title: project.title,
          href: "/chambers/the-structure-beneath-reality",
          note: project.centralQuestion,
        },
      ],
    },
    ...hubs.map((hub) => ({
      id: hub.question.id,
      label: hub.question.title.replace("?", ""),
      sublabel: `${hub.essays.length + hub.books.length + hub.fieldNotes.length} artifacts`,
      items: [
        ...hub.essays.map((e) => ({
          title: e.title,
          href: `/essays/${e.slug}`,
          note: "Essay",
        })),
        ...hub.books.map((b) => ({
          title: b.title,
          href: `/atlas/${b.slug}`,
          note: "Volume",
        })),
        ...hub.fieldNotes.map((fn) => ({
          title: fn.title ?? "Field observation",
          href: `/field-notes/${fn.slug}`,
          note: "Field note",
        })),
      ],
    })),
    {
      id: "unfiled",
      label: "Recent Discoveries",
      sublabel: "Essays on Medium",
      items: essays.map((e) => ({
        title: e.title,
        href: `/essays/${e.slug}`,
        note: e.topics[0],
      })),
    },
  ];

  const openDrawer = drawers.find((d) => d.id === openId);

  return (
    <ConceptShell
      title="Concept 02 — The Archive"
      hint="Click a drawer · pull open what calls to you"
    >
      <div className="flex h-full flex-col bg-[#1a1510]">
        <div className="shrink-0 border-b border-[#3d3228] px-6 py-5">
          <p className="font-heading text-lg text-[#e8dcc8]">
            After hours. The archive is yours.
          </p>
          <p className="mt-1 text-sm text-[#8a7a68]">
            Every drawer holds a thread of the inquiry.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {drawers.map((drawer) => {
              const isOpen = openId === drawer.id;
              return (
                <button
                  key={drawer.id}
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : drawer.id)}
                  className="group text-left"
                >
                  <div
                    className={`relative border-2 transition-all duration-500 ${
                      isOpen
                        ? "border-[#c4a574] bg-[#2a2218]"
                        : "border-[#3d3228] bg-[#221c16] group-hover:border-[#5c4d3a]"
                    }`}
                  >
                    {/* Drawer face */}
                    <div className="flex h-24 items-center gap-4 px-5">
                      <div
                        className={`h-8 w-2 rounded-sm transition-colors ${
                          isOpen ? "bg-[#c4a574]" : "bg-[#4a3f32] group-hover:bg-[#6a5a42]"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm text-[#e8dcc8]">
                          {drawer.label}
                        </p>
                        <p className="truncate text-[0.6875rem] text-[#8a7a68]">
                          {drawer.sublabel}
                        </p>
                      </div>
                    </div>

                    {/* Drawer interior */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.45, 0.05, 0.55, 0.95] }}
                          className="overflow-hidden border-t border-[#3d3228]"
                        >
                          <ul className="space-y-0 p-4">
                            {drawer.items.length === 0 ? (
                              <li className="text-sm text-[#8a7a68]">
                                Empty — for now.
                              </li>
                            ) : (
                              drawer.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className="block border-b border-[#3d3228]/60 py-3 transition-colors hover:text-[#c4a574]"
                                  >
                                    <span className="text-[0.625rem] uppercase tracking-wider text-[#6a5a48]">
                                      {item.note}
                                    </span>
                                    <p className="mt-1 text-sm text-[#d4c8b4]">
                                      {item.title}
                                    </p>
                                  </Link>
                                </li>
                              ))
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {openDrawer && openDrawer.items.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="shrink-0 border-t border-[#3d3228] px-6 py-3 text-center text-[0.6875rem] text-[#6a5a48]"
            >
              {openDrawer.items.length} item
              {openDrawer.items.length !== 1 ? "s" : ""} in this drawer — pull
              another to compare threads
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ConceptShell>
  );
}
