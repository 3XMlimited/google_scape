"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchForm = ({
  setData,
  fetchGoogle,
  search,
  setSearch,
  // setChannelList,
}) => {
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    let keyword;
    if (search.site === "all") {
      keyword = ` "${search.value}"  "@${search.mail}" `;
    } else {
      keyword = `site:${search.site}.com "${search.value}"  "@${search.mail}" `;
    }

    console.log(keyword);
    const data = await fetchGoogle(keyword);
    const result = data.data.results;
    let match;
    var emailRegex =
      /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

    result.map((r) => {
      try {
        match = emailRegex.exec(r.description);
        r.email = match[0];
      } catch (error) {
        try {
          match = emailRegex.exec(r.title);
          r.email = match[0];
        } catch (error) {
          r.email = "";
        }
      }
    });
    console.log(result);
    setData(result);

    setIsLoading(false);
  };
  return (
    <div className="flex justify-center items-center mx-auto mt-10 w-full sm:mt-10 sm:px-5">
      <div className="mr-2">
        <Select
          value={search.site}
          onValueChange={(e) =>
            setSearch((prev) => ({
              ...prev,
              site: e,
            }))
          }
        >
          <SelectTrigger className="h-fit border-0 bg-black-400 py-6 w-[180px]  text-white-800 placeholder:text-white-800 !ring-0 !ring-offset-0">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">Youtube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="all">Any Site</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <label className="flex justify-center items-center relative w-full max-w-3xl">
        <Image
          src="/magnifying-glass.svg"
          className="absolute left-8"
          width={32}
          height={32}
          alt="Search icon"
        />
        <Input
          className="h-fit border-0 bg-black-400 py-6 pl-20 pr-8 text-white-800 placeholder:text-white-800 !ring-0 !ring-offset-0"
          placeholder="Search"
          type="text"
          value={search.keyword}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, value: e.target.value }))
          }
        />

        <Button
          variant="outline"
          disabled={isLoading}
          className="absolute right-8"
          onClick={() => fetchData()}
          isLoading={isLoading}
        >
          {isLoading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <> Search</>
          )}
        </Button>
      </label>

      <Input
        className="ml-2 h-fit border-0 bg-black-400 py-6 pl-6 pr-2 text-white-800 placeholder:text-white-800 !ring-0 !ring-offset-0 w-[150px]"
        placeholder="gmail.com"
        type="text"
        value={search.mail}
        onChange={(e) =>
          setSearch((prev) => ({ ...prev, mail: e.target.value }))
        }
      />
    </div>
  );
};

export default SearchForm;

// # apikeyOld = AIzaSyC52exehmGd-AUCjVAtp7sqhFFn4J2SYPs
// # apikeyOld2 = AIzaSyA8gbo70IvC6fiCJoXVXacB4_xwLEFPGKA
