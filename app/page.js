"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import DataTableDemo from "@/components/DataTableDemo";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
// import { fakeData } from "@/utils/utils";
import exportFromJSON from "export-from-json";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Link as LinkIcon } from "lucide-react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

let platform = ["youtube", "facebook", "instagram", "twitter", "tiktok"];
let mails = [
  "gmail.com",
  "icloud.com",
  "me.com",
  "outlook.com",
  "hotmail.com",
  "mail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
];

const Page = () => {
  // const [data, setData] = useState(fakeData);
  const [data, setData] = useState([]);
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState({
    site: "all",
    value: "",
    mail: "gmail.com",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = useState(false);

  // useEffect(() => {
  // let channels = localStorage.getItem("channels");
  // console.log(channels.split(","));
  // setChannelList(channels?.split(",") || []);
  // }, []);

  useEffect(() => {
    if (data) {
      let allEmails = data?.map((d) => d.email);
      allEmails = allEmails.filter((email) => email != "");
      allEmails = Array.from(new Set(allEmails));
      setEmails((prev) => [...prev, ...allEmails]);
      let forLocalEmails = [];
      allEmails.map((e) => {
        forLocalEmails.push({
          keyword: search.value,
          platform: search.site,
          email: e,
          dateTime: moment().format("YYYY-MM-DD HH:mm"),
        });
      });
      let memoryEmails = JSON.parse(localStorage.getItem("emails"));
      if (memoryEmails && memoryEmails.length > 0) {
        memoryEmails = [...memoryEmails, ...forLocalEmails];
      } else {
        memoryEmails = forLocalEmails;
      }
      localStorage.setItem("emails", JSON.stringify(memoryEmails));
    }
  }, [data]);

  const exportCsv = () => {
    const fileName = prompt("file name:");
    const exportType = exportFromJSON.types.csv;

    let result = Array.from(new Set(emails));
    let results = [];
    result.map((r) => {
      results.push({ email: r });
    });
    exportFromJSON({ data: results, fileName, exportType });
  };

  const fetchGoogle = async (search) => {
    try {
      const response = await fetch("/api/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
      });
      const result = await response.json();

      if (!result.data) {
        alert("ERROR: API LIMITED");
        setIsLoading(false);
        setSearch("");
      }
      return result;
    } catch (error) {
      console.log("error", error);
      alert("ERROR: API LIMITED");
    }
  };

  const fetchGoogleAllSite = async (search) => {
    let results = [];
    for (let index = 0; index < platform.length; index++) {
      const site = platform[index];
      console.log("site", site);
      for (let i = 0; i < mails.length; i++) {
        const mail = mails[i];
        let value = `site:${site}.com "${search}" "${mail}" `;
        try {
          const response = await fetch("/api/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ search: value }),
          });
          const result = await response.json();
          // const result = data.data.results;
          if (result.data.results) {
            results.push(...result.data.results);
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
    return results;
  };

  // const clearChannel = () => {
  //   localStorage.removeItem("channels");
  //   setChannelList([]);
  // };
  return (
    <main className="flex justify-center items-center mx-auto w-full max-w-screen-2xl flex-col  sm:p-16 xs:p-8 py-12 ">
      <section className="py-[98px] w-full  ">
        <div className="flex justify-center items-center relative  w-full flex-col text-center">
          <h1 className="sm:text-[64px] sm:leading-[67.2px] sm:font-bold font-bold text-[48px] leading-[50.4px] text-center mb-6">
            Google Search Scrape
          </h1>

          <SearchForm
            setData={setData}
            fetchGoogle={fetchGoogle}
            fetchGoogleAllSite={fetchGoogleAllSite}
            search={search}
            setSearch={setSearch}
            platform={platform}
            version={version}
            setVersion={setVersion}
            // setChannelList={setChannelList}
          />
        </div>

        {data && data.length > 0 && (
          <>
            <div className="w-full mt-[20px]  my-10 relative">
              {/* <DataTableDemo data={fakeData} /> */}
              {isLoading && (
                <div className="z-50 absolute w-full ">
                  <div className=" bg-black-100/50   h-[500px]  flex justify-center items-center ">
                    <ReloadIcon className="mr-2 h-48 w-48  animate-spin text-white-800   rounded-lg " />
                  </div>
                </div>
              )}

              <div className="h-[500px] overflow-y-scroll ">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Title</TableHead>
                      <TableHead className="w-[100px]">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium w-full ">
                          <Link
                            href={`https://www.youtube.com/watch?v=${d.url}`}
                            target="_blank"
                          >
                            <p className="w-full flex  gap-x-2 ">
                              <LinkIcon /> {d.title}
                            </p>
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium w-full ">
                          {d.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* <div className="w-full flex justify-between items-center border-b-2  py-2 ">
              <div className="text-slate-500">
                {data.data.length} of {data.videosInfo.pageInfo.totalResults}
                results(s)
              </div>
              <Button variant="outline" size="sm" onClick={fetchData}>
                {isLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <> Next Page</>
                )}
              </Button>
            </div> */}
          </>
        )}

        {emails.length > 0 && (
          <div className="w-full ">
            <h1 className="pt-[78px] sm:text-[64px] sm:leading-[67.2px] sm:font-bold font-bold text-[48px] leading-[50.4px] text-center mb-6">
              Email Scrape
            </h1>
            <div className="w-full flex justify-end items-center">
              <Button className="" onClick={exportCsv}>
                Export to csv
              </Button>
            </div>

            <div className="h-[500px] overflow-y-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Email</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="">
                  {emails.map((email, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium  ">{email}</TableCell>
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
      </section>
    </main>
  );
};

export default Page;
