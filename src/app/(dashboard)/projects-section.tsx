'use client';

import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import {
  AlertTriangle,
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontal,
  Search,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useDuplicateProject } from '@/features/projects/use-duplicate-project';
import { useDeleteProject } from '@/features/projects/api/use-delete-project';
import { useConfirm } from '@/hooks/use-confirm';

export const ProjectsSection = () => {
  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you sure ?',
    'You are about to delete this project',
  );
  const router = useRouter();
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetProjects();

  const duplicateMutation = useDuplicateProject();

  const removeMutation = useDeleteProject();

  const onDelete = async (id: string) => {
    const ok = await confirm();

    if (ok) {
      removeMutation.mutate({ id });
    }
  };

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  if (status === 'pending') {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>

        <div className="flex flex-col gappy-4 items-center justify-centerh-32">
          <Loader className="size-6 animate-spin text-muted-foreground " />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>

        <div className="flex flex-col gappy-4 items-center justify-centerh-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to load projects
          </p>
        </div>
      </div>
    );
  }

  if (!data.pages.length || !data.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>

        <div className="flex flex-col gappy-4 items-center justify-centerh-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ConfirmationDialog />
      <h3 className="font-semibold text-lg">Recent Projects</h3>

      <Table>
        <TableBody>
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell
                    className="font-medium flex items-center gap-x-2 cursor-pointer"
                    onClick={() => router.push(`/editor/${project.id}`)}
                  >
                    <FileIcon className="size-6" />
                    {project.name}
                  </TableCell>
                  <TableCell
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => router.push(`/editor/${project.id}`)}
                  >
                    {project.width} X {project.height} px
                  </TableCell>
                  <TableCell className="hidden md:table-cell cursor-pointer">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>

                  <TableCell className="flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" disabled={false}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem
                          className="h-10 cursor-pointer 
                            "
                          disabled={duplicateMutation.isPending}
                          onClick={() => onCopy(project.id)}
                        >
                          <CopyIcon className="size-4 mr-2" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-10 cursor-pointer text-red-500"
                          disabled={removeMutation.isPending}
                          onClick={() => onDelete(project.id)}
                        >
                          <TrashIcon className="size-4 mr-2 text-red-500" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant="ghost"
            className="relative px-6 py-2 text-sm font-medium text-white rounded-md 
                 bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]
                 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-all duration-300 ease-in-out"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-[#3faff5] via-[#0073ff] to-[#2e62cb] 
                       transform translate-x-[-100%] transition-transform duration-300 ease-in-out 
                       hover:translate-x-0"
            ></span>
            <span className="relative z-10">
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
