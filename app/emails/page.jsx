"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import exportFromJSON from "export-from-json";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Page = () => {
  const [emails, setEmails] = useState([]);

  const exportCsv = () => {
    const fileName = prompt("file name:");
    const exportType = exportFromJSON.types.csv;

    let result = Array.from(new Set(emails));
    let results = [];
    result.map((r) => {
      results.push({ email: r.email });
    });
    exportFromJSON({ data: results, fileName, exportType });
  };

  const clearMemory = () => {
    localStorage.removeItem("emails");
    setEmails([]);
  };

  useEffect(() => {
    setEmails(JSON.parse(localStorage.getItem("emails")));
  }, []);

  return (
    <div className="flex justify-center items-center mx-auto w-full max-w-screen-2xl flex-col  sm:p-16 xs:p-8 py-12 pt-[98px]  ">
      {emails && emails.length > 0 && (
        <div className="w-full ">
          <h1 className="pt-[78px] sm:text-[64px] sm:leading-[67.2px] sm:font-bold font-bold text-[48px] leading-[50.4px] text-center mb-6">
            Local Memory Email
          </h1>
          <div className="w-full flex justify-end items-center gap-x-3">
            <Button variant="destructive" onClick={clearMemory}>
              Clear Memory
            </Button>
            <Button className="" onClick={exportCsv}>
              Export to csv
            </Button>
          </div>

          <div className="h-[500px] overflow-y-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Email</TableHead>
                  <TableHead className="w-[100px]">Keyword</TableHead>
                  <TableHead className="w-[100px]">Platform</TableHead>
                  <TableHead className="w-[100px]">DateTime</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="">
                {emails.map((email, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium  ">
                      {email.email}
                    </TableCell>
                    <TableCell className="font-medium  ">
                      {email.keyword}
                    </TableCell>
                    <TableCell className="font-medium  ">
                      {email.platform}
                    </TableCell>
                    <TableCell className="font-medium  ">
                      {email.dateTime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="w-full flex justify-center items-center">
            <p className="text-slate-500 text-[14px]">
              A list of your email collect. ({emails.length} emails)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

// for the normal website should no problem we can just trying web scrape, but for the big company website for sure they will protact the data,no be easily get
// that's why before when we wanna get the followers  need to use that own api, and usuanlly has rules or limit .
